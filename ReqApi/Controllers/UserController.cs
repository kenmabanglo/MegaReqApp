using ReqApi.BusinessLogic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReqApi.DTO;
using ReqApi.Models;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;
using ReqApi.Models.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using ReqApi.DataLogic;

namespace ReqApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JWTConfig _jWTConfig;
        private readonly ReqappDBContext dBContext;

        public UserController(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<JWTConfig> jwtconfig,
            ReqappDBContext dBContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jWTConfig = jwtconfig.Value;
            this.dBContext = dBContext;
        }

        [HttpPost("Login")]
        public async Task<object> Login([FromBody] LoginBindingModel model)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                try
                {
                    if (ModelState.IsValid)
                    {
                        var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
                        if (result.Succeeded)
                        {
                            var appUser = await _userManager.FindByNameAsync(model.UserName);

                            UserSetting userSettings = UserMasterDLL.GetUserBranch(dBContext, appUser.UserName);
                            
                            if (userSettings == null)
                            {
                                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "user not found", null));
                            }

                            if (userSettings.Active == 0)
                            {
                                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, $"Please ask ICTD to activate your account ({appUser.UserName}).", null));
                            }

                            else if (userSettings.Active == 3)
                            {
                                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, $"This account ({appUser.UserName}) is deactivated.", null));
                            }

                            UserDTO user = new UserDTO(appUser.Id, appUser.Email, appUser.UserName, appUser.FirstName, appUser.LastName, appUser.Created, "", "", 0, null, userSettings.PositionName);
                            userSettings.Image = new byte[] { };
                            user.UserSettings = userSettings;
                            user.BranchCode = userSettings.BranchCode;

                            var role = await _userManager.GetRolesAsync(appUser);

                            user.Role = role.FirstOrDefault();

                            // user rights
                            var rights = UserRightsMasterDLL.GetAllRightsByUser(dBContext, model.UserName);
                            user.Rights = rights;

                            user.Token = await GenerateToken(appUser, user.Role);


                            // check if approver
                            var count_r = RequestMasterDLL.CountRequestsForApprovalByApprover(dBContext, user.UserName);
                            var count_h = RequestMasterDLL.CountHistoryApprovedRequestsByApprover(dBContext, user.UserName);
                            user.Approver = count_r > 0 || count_h > 0 ? 1 : 0;

                            return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "", user));
                        }
                    }

                    transaction.Commit();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "invalid email or password", null));


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));

                }

            }

        }

        [HttpPost("RegisterUser/{role}")]
        public async Task<object> RegisterUser(string role, [FromBody] AddUpdateRegisterUserBindingModel model)
        {
            try
            {

                // check user fullname existence
                var exists = dBContext.UserSettings.Where(x => x.FullName == model.FullName).Count();
                if (exists > 0)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, model.FullName + " already exists! Kindly contact ICTD for your lost account.", null));
                }

                model.Role = role == "" ? "User" : role; // default user role

                var user = new ApplicationUser() { UserName = model.UserName, Email = model.Email, Created = DateTime.UtcNow, Updated = DateTime.UtcNow, FirstName = model.FirstName, LastName = model.LastName };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                  
                    // ADD USER TO ROLE
                    await _userManager.AddToRoleAsync(user, model.Role);

                    // ADD USER TO USER SETTINGS
                    var userSettings = new UserSetting();
                    userSettings.FullName = model.FullName;
                    userSettings.UserName = model.UserName;
                    userSettings.UserType = model.UserType;
                    userSettings.PositionName = model.PositionName;
                    userSettings.BranchCode = model.BranchCode;

                    dBContext.UserSettings.Add(userSettings);

                    await dBContext.SaveChangesAsync();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, $"Registered! Please Contact ICTD to activate this account {model.UserName}. Thank You!", null));
                }
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "", result.Errors.Select(x => x.Description).ToArray()));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("UpdateUser/{Id:guid}")]
        [Authorize]
        public async Task<object> UpdateUser([FromBody] AddUpdateRegisterUserBindingModel model, [FromRoute] Guid Id)
        {

            try
            {

                if (Id != model.Id)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "Bad Request", null));
                }
                var user = await _userManager.FindByIdAsync(Id.ToString());

                if (user == null)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "Not Found", null));

                }
                user.UserName = model.UserName;
                user.Email = model.Email;
                user.Updated = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "User has been Updated", null));
                }
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "", result.Errors.Select(x => x.Description).ToArray()));
            }
            catch (Exception ex)
            {

                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("UpdateProfile"), DisableRequestSizeLimit]
        [Authorize]
        public IActionResult UpdateProfile()
        {
            var userData = Request.Form;
            var file = Request.Form.Files;
            byte[] image_stream = new byte[] { };
            Dictionary<string, string> user = new Dictionary<string, string>();
            var u = new UserSetting();
            var uname = String.Empty;
            foreach (var key in userData.Keys)
            {
                if (key.ToString() == "userName") uname = userData[key.ToString()];
                user[key.ToString()] = userData[key.ToString()];
            }

            var exists = dBContext.UserSettings.Where(t => t.UserName == uname).FirstOrDefault();
            if (exists == null)
            {
                return NotFound();
            }


            if (file.Count > 0)
            {
                // generate image blob
                var imagefile = file[0];
                if (imagefile.Length > 0)
                {

                    using (var stream = new MemoryStream())
                    {
                        imagefile.CopyToAsync(stream);
                        image_stream = stream.ToArray();
                    }
                }
            }



            return Ok(uname);
            // check if user exists
            //var exists = dBContext.UserSettings.Where(t => t.UserName == user[1].value).Single();



        }


        [HttpGet("GetUser/{Id:guid}")]
        //[Authorize]
        public async Task<object> GetUser([FromRoute] Guid Id)
        {
            try
            {
                var appUser = await _userManager.FindByIdAsync(Id.ToString());

                {
                    if (appUser == null)
                        return await Task.FromResult(NotFound());
                }
                var user = new UserDTO(appUser.Id, appUser.Email, appUser.UserName, appUser.FirstName, appUser.LastName, appUser.Created, "", "");

                var Role = await _userManager.GetRolesAsync(appUser);
                user.Role = Role.FirstOrDefault();
                user.UserSettings = UserMasterDLL.GetUserSettings(dBContext, appUser.UserName);

                return await Task.FromResult(user);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }


        }


        [HttpGet("GetAllUser")]
        //[Authorize]
        public async Task<object> GetAllUser([FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "")
        {
            try
            {
                var users = UserMasterDLL.GetAllUserSettings(dBContext, pageIndex, pageSize, search);

                return await Task.FromResult(users);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }
        [HttpGet("GetAllBranches")]
        public async Task<object> GetAllBranches([FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "")
        {
            try
            {
                var branches = UserMasterDLL.GetAllBranch(dBContext, pageIndex, pageSize, search);
                return await Task.FromResult(branches);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));

            }

        }

        [HttpGet("GetAllUsersByBranch")]
        //[Authorize]
        public async Task<object> AllUserSettingsByBranch([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string branchCode = "", [FromQuery] string search = "", [FromQuery] string userName = "", [FromQuery] string positionName = "")
        {
            try
            {
                var users = UserMasterDLL.GetAllUserSettingsByBranch(dBContext, branchCode, pageIndex, pageSize, search, userName, positionName);

                return await Task.FromResult(users);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetUserRights")]
        //[Authorize]
        public async Task<object> GetUserRights([FromQuery] string userName)
        {
            try
            {
                var users = UserRightsMasterDLL.GetAllRightsByUser(dBContext, userName);

                return await Task.FromResult(users);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }


        [HttpGet("GetPositionRanks")]
        //[Authorize]
        public async Task<object> GetPositionRanks()
        {
            try
            {
                var ranks = UserMasterDLL.GetAllPositionRanks(dBContext);

                return await Task.FromResult(ranks);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }


        [HttpGet("GetAllApprovers")]
        //[Authorize]
        public async Task<object> GetAllApprovers([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string branchCode = "", [FromQuery] string search = "", [FromQuery] string userName = "", [FromQuery] string positionName = "", [FromQuery] int approverNum = 0, [FromQuery] string reqType = null, [FromQuery] decimal estimatedAmt = 0)
        {
            try
            {
                var users = UserMasterDLL.GetAllApproversByBranchOrDistrict(dBContext, branchCode, pageIndex, pageSize, search, userName, positionName, approverNum, reqType, estimatedAmt);

                return await Task.FromResult(users);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }
 
        [HttpGet("GetAllApproversNew")]
        public async Task<object> GetAllApproversNew([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string branchCode = "", [FromQuery] string search = "", [FromQuery] string userName = "", [FromQuery] string positionName = "", [FromQuery] int approverNum = 0, [FromQuery] string reqType = null, [FromQuery] decimal estimatedAmt = 0)
        {
            try
            {
                // var users = UserMasterDLL.GetAllApproversByBranchOrDistrict(dBContext, branchCode, pageIndex, pageSize, search, userName, positionName, approverNum, reqType, estimatedAmt);
                var raw_data = new List<UserSetting>();

                if (approverNum == 1)
                    raw_data = UserMasterDLL.GetInitialApprover(dBContext, branchCode, pageIndex, pageSize, search, userName, positionName, approverNum, reqType, estimatedAmt);
               else if (approverNum == 2)
                    raw_data = UserMasterDLL.GetNextOrFinalApprover(dBContext, branchCode, pageIndex, pageSize, search, userName, positionName, approverNum, reqType, estimatedAmt);

                var users = raw_data.Select(x => new UserSelectDTO(x.UserName, x.BranchCode, x.PositionName, x.FullName, x.Active)).ToList();

                var page = new PaginatedResponse<UserSelectDTO>(users, pageIndex, pageSize);

                var totalCount = raw_data.Count();
                var totalPages = Math.Ceiling((double)totalCount / pageSize);

                var response = new
                {
                    Page = page,
                    TotalPages = totalPages
                };

                return await Task.FromResult(response);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("GetAllApproversNoBranch")]
        public async Task<object> GetAllApproversNoBranch([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string userName = "")
        {
            try
            {
                var users = UserMasterDLL.GetAllUserApprovers(dBContext, pageIndex, pageSize, search, userName);
      
                return await Task.FromResult(users);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }


        [HttpGet("IsFinalApprover")]
        public async Task<object> IsFinalApprover([FromQuery] string userName = "", [FromQuery] int approverNum = 0, [FromQuery] decimal estimatedAmt = 0, [FromQuery] string requestTypeCode="")
        {
            var response = false;
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                try
                {
                    var userSettings = dBContext.UserSettings.Where(x => x.UserName == userName).Select(x => new { x.PositionRank, x.PositionName, x.StoreBased }).FirstOrDefault();

                    //if (requestTypeCode == "RFA" || requestTypeCode == "RFP" || requestTypeCode == "ADB")
                    //{
                        string sql1 = String.Format("SELECT * FROM UserApprovalMatrix WHERE positionRank = '{0}' ", userSettings.PositionRank.Trim());

                        var current_level = dBContext.UserApprovalMatrix.FromSqlRaw(sql1).Select(x => x.Level).Max();

                        string app = approverNum == 1 ? "  AND Approver1 = 'Y' " : "  AND Approver2 = 'Y' ";

                        string sql2 = String.Format("SELECT * FROM UserApprovalMatrix WHERE '{0}' BETWEEN limitFrom AND limitTo {1} ", estimatedAmt, app);

                        var needed_level = dBContext.UserApprovalMatrix.FromSqlRaw(sql2).Select(x => x.Level).Max();

                        var approver_num_level = dBContext.UserApprovalMatrix.FromSqlRaw(sql2).Select(x => x.Level).Max();

                        if (approverNum == 1 &&
                            (current_level < needed_level)
                        )
                        {
                            response = false;
                        }
                        else if (approverNum == 2 &&
                            (current_level < needed_level)
                            )
                        {
                            response = false;
                        }
                        else
                        {
                            response = true;
                        }
                    //}

                    //else if (requestTypeCode == "RFS" || requestTypeCode == "RS" || requestTypeCode == "RTO")
                    //{
                    //    if (userSettings.PositionRank)
                    //    {

                    //    }
                    //}
                        transaction.Commit();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "IsthisAFinalApproval?", response));

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
                }

            }
        }

        [HttpGet("GetAllInactiveUsers")]
        //[Authorize]
        public async Task<object> GetAllInactiveUsers([FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "")
        {
            try
            {
                var users = UserMasterDLL.GetAllInactiveUsers(dBContext, pageIndex, pageSize, search);

                return await Task.FromResult(users);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("CountInactiveUsers")]
        public async Task<object> InactiveUsers([FromQuery] string userName)
        {
            try
            {
                var count = UserMasterDLL.CountAllInactiveUsers(dBContext);
                return await Task.FromResult(count);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpPost("Upload"), DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var user = dBContext.UserSettings.Where(t => t.UserName == "admin").Single();

                if (file.Length > 0)
                {
                    // save to folder /Resources/Images
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    // save blob data to database
                    using (var stream = new MemoryStream())
                    {
                        file.CopyToAsync(stream);
                        user.Image = stream.ToArray();
                    }

                    return Ok(new { dbPath, user });
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost("UploadBlob")]

        public async Task<IActionResult> UploadBlob()
        {
            var formFile = Request.Form.Files[0];

            // limit size
            var user = dBContext.UserSettings.Where(t => t.UserName == "admin").Single();

            if (formFile.Length > 0)
            {

                using (var stream = new MemoryStream())
                {
                    await formFile.CopyToAsync(stream);
                    user.Image = stream.ToArray();
                }

                dBContext.UserSettings.Update(user);
                await dBContext.SaveChangesAsync();
            }


            //var ruser = dBContext.UserSettings.Where(t => t.UserName == "admin").Single();
            //var base64 = Convert.ToBase64String(user.Image);
            //user.ImagePath = string.Format("data:image/jpeg;base64,{0}", base64);
            return Ok(user);
        }

        [HttpPost("AssignUserBranch")]
        //[Authorize]
        public async Task<object> AssignUserBranch([FromBody] AddUpdateRegisterUserBindingModel model)
        {
            using (var transaction = await dBContext.Database.BeginTransactionAsync())
            {
                try
                {

                    var existing = dBContext.UserSettings.Where(x => x.UserName == model.UserName.Trim()).FirstOrDefault();
                    if (existing == null)
                    {
                        return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "NotFound", null));
                    }

                    existing.BranchCode = model.BranchCode.Trim();
                    dBContext.Entry(existing).State = EntityState.Modified;

                    dBContext.SaveChanges();
                    transaction.Commit();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, $"{model.BranchCode} Branch has been Assigned to the User {model.UserName}", null));
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));

                }
            }
        }

        [HttpPost("AssignUserApprover")]
        //[Authorize]
        public async Task<object> AssignUserApprover([FromBody] UserApprover model)
        {
                string message = string.Empty;

                try
                {
                    var tranId = UserMasterDLL.AssignApproverToUser(dBContext, model);
                    
                if (!String.IsNullOrEmpty(model.UserName))
                {
                    message = "the User "+model.UserName;
                }
                else if (!String.IsNullOrEmpty(model.BranchCode))
                {
                    message = "the Branch "+ model.BranchCode;
                }
                else if (!String.IsNullOrEmpty(model.PositionName))
                {
                    message = "the Position "+ model.PositionName;
                }

                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, $"Approver {model.ApproverUserName} has been assigned to "+message, null));
                }
                catch (Exception ex)
                { 
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));

                }
        }
        // Ken - Get the Current User Approver (with specific details from other tables) - 6/19/2024
        [HttpGet("GetCurrentUserApprover")]
        public IActionResult GetCurrentUserApprover([FromQuery] string userName)
        {
            try
            {
                var userCurrentApprover = UserMasterDLL.GetUserApprover(dBContext, userName);

                return Ok(userCurrentApprover);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Ken - Get the Current Branches assigned to User based from userName  - 6/25/2024
        [HttpGet("GetCurrentUserBranch")]
        public IActionResult GetCurrentUserBranch([FromQuery] string userName)
        {
            try
            {
                var userCurrentBranch = UserMasterDLL.GetCurrentUserBranch(dBContext, userName);
                return Ok(userCurrentBranch);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // Ken - Delete User Approver (tranId) - 6/19/2024
        [HttpDelete("DeleteUserApprover")]
        public async Task<IActionResult> DeleteUserApprover(string tranId)
        {
            using (var transaction = await dBContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (!Guid.TryParse(tranId, out Guid guidTranId))
                    {
                        return BadRequest(new ResponseDTO(ResponseCode.Error, "Invalid transaction ID format.", null));
                    }

                    var approver = await dBContext.UserApprovers.FindAsync(guidTranId);

                    if (approver == null)
                    {
                        return NotFound(new ResponseDTO(ResponseCode.Error, "Approver not found.", null));
                    } 
                     
                    dBContext.UserApprovers.Remove(approver);
                    await dBContext.SaveChangesAsync();

                    transaction.Commit();
                    return Ok(new ResponseDTO(ResponseCode.OK, "Approver deleted successfully.", null));
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(new ResponseDTO(ResponseCode.Error, ex.Message, null));
                }
            }
        }
        //

        // Ken - Add User Branch (userName & branchCode) - 6/28/2024
        [HttpPost("AddUserBranch")]
        public async Task<object> AddUserBranch([FromBody] UserBranchMaster model)
        {
            string message = string.Empty;

            try
            {
                var userName = UserMasterDLL.AddUserBranch(dBContext, model);

                return await Task.FromResult(new ResponseDTO(ResponseCode.OK, $"{model.BranchCode} has been assigned to this user.", null));
                
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));

            }
        }

        // Ken - Delete User Branch (userName & branchCode) - 6/26/2024
        [HttpDelete("DeleteUserBranch")]
        public async Task<IActionResult> DeleteUserBranch(string userName, string branchCode, string divisionName)
        {
            using (var transaction = await dBContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var branch = await dBContext.UserBranchMasters.FindAsync(userName, branchCode);

                    if (branch == null)
                    {
                        return NotFound(new ResponseDTO(ResponseCode.Error, $"{divisionName} branch cannot be found for this user.", null));
                    }

                    dBContext.UserBranchMasters.Remove(branch);
                    await dBContext.SaveChangesAsync();

                    transaction.Commit();
                    return Ok(new ResponseDTO(ResponseCode.OK, $"{divisionName} branch has been successfully deleted from this user.", null));
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(new ResponseDTO(ResponseCode.Error, ex.Message, null));
                }
            }
        }
        //
        public static UserApprover GetUserApprover(ReqappDBContext dbContext, string userName)
        {
            string sql = String.Format("SELECT * FROM UserApprovers WHERE userName = {0}", userName.Trim());

            var raw_data = dbContext.UserApprovers.FromSqlRaw(sql).FirstOrDefault();

            return raw_data;
        }


        [HttpPost("ChangePassword")]
        public async Task<object> ChangePassword([FromBody] ChangePasswordBindingModel model)
        {
            using (var transaction = await dBContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(model);
                    }

                    var user = await _userManager.FindByEmailAsync(model.Email);
                    if (user == null)
                    {
                        return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "Password changed Successfully.", null));
                    }

                    user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, model.Password);

                    var result = await _userManager.UpdateAsync(user);

                    if (result.Succeeded)
                    {
                        return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "Password changed Successfully.", null));
                    }
                    transaction.Commit();
                    transaction.Dispose();
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "There was a problem changing password.", null));


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
                }
            }
        }

        [HttpPost("UpdateUserSettings")]
        //[Authorize]
        public async Task<object> UpdateUserSettings([FromBody] AddUpdateRegisterUserBindingModel model)
        {
            using (var transaction = await dBContext.Database.BeginTransactionAsync())
            {
                try
                {

                    var existing = dBContext.UserSettings.Where(x => x.UserName == model.UserName.Trim()).FirstOrDefault();
                    if (existing == null)
                    {
                        return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "User Not Found", null));
                    }
                    if (!String.IsNullOrEmpty(model.StoreBased))
                    {
                        existing.StoreBased = model.StoreBased;
                    }

                    if (!String.IsNullOrEmpty(model.PositionRank))
                    {
                        existing.PositionRank = model.PositionRank;
                    }
                     
                     existing.Active = model.Active;
                    
                     

                    dBContext.Entry(existing).State = EntityState.Modified;

                    dBContext.SaveChanges();
                    transaction.Commit();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, $" User has been updated ({model.UserName})", null));
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();

                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));

                }
            }
        }



        private async Task<string> GenerateToken(ApplicationUser user, string Role)
        {
            // GET VALID CLAIMS

            // get role assigned to user
            // var role = await _userManager.GetRolesAsync(user);

            IdentityOptions _options = new IdentityOptions();

            var claims = new List<Claim>(){
                new Claim(JwtRegisteredClaimNames.NameId,user.Id),
                new Claim(JwtRegisteredClaimNames.Name,user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                //new Claim(_options.ClaimsIdentity.RoleClaimType,role.FirstOrDefault())
                new Claim(_options.ClaimsIdentity.RoleClaimType,Role)
           };


            // GENERATE TOKEN
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jWTConfig.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _jWTConfig.Audience,
                Issuer = _jWTConfig.Issuer
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return await Task.FromResult(jwtTokenHandler.WriteToken(token));
        }
    }

}
