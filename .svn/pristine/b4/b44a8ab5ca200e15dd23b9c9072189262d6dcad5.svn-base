using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using ReqApi.Models;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Claims;
using ReqApi.Models.Context;
using ReqApi.DTO;
using ReqApi.Models.Enums;
using ReqApi.Models.Entities;
using ReqApi.DataLogic;
using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;

namespace ReqApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserBranchController : ControllerBase
    {
        private readonly ReqappDBContext dbContext;

        public UserBranchController(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpPost("AssignUserBranch")]
        public async Task<object> AssignUserBranch(UserBranchMaster[] ubm)
        {
            try
            {
                var exists = dbContext.UserSettings.Where(s => s.UserName == ubm[0].UserName).FirstOrDefault();
                if(exists == null)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "User Not Found", null));
                }
                foreach (var b in ubm)
                {
                    var ub = new UserBranchMaster();
                    ub.UserName = b.UserName;
                    ub.BranchCode = b.BranchCode;
                    ub.DateAdd = DateTime.Now;
                    dbContext.UserBranchMasters.Add(ub);
                }

                var result = await dbContext.SaveChangesAsync();
                if (result > 0)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "Branches has been assigned to the user.", null));
                }

                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, "", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

    }
}
