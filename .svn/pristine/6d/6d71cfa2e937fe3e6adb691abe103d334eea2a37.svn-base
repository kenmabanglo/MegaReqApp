using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReqApi.DataLogic;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;
using ReqApi.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace ReqApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class RequestMasterController : ControllerBase
    {
        private readonly ReqappDBContext dbContext;

        public RequestMasterController(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("SendRequest")]
        public async Task<object> Send([FromBody] RequestMasterBindingModel model)
        {
            string msg = "";
            string requestNo = String.Empty;

            try
            {

                requestNo = RequestMasterDLL.SaveRequest(dbContext, model);

                if (requestNo != null)
                {

                    msg = "Request No. " + requestNo + " has been saved successfully!";
                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, msg, requestNo));
                }
                else
                {
                    msg = "There was an error saving the request";
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, requestNo));
                }


            }
            catch (Exception ex)
            {
                msg = ex.InnerException.Message;
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, null));
            }


        }

        [HttpPost("UpdateRequest")]
        public async Task<object> UpdateRequest([FromBody] RequestMasterBindingModel bmodel)
        {
            string msg = "";
            string requestNo = String.Empty;
            var model = bmodel.B_RequestMaster;
            var items = bmodel.B_RequestItems;

            var request = dbContext.RequestMasters.Where(x => x.RequestTypeCode == model.RequestTypeCode && x.BranchCode == model.BranchCode && x.RequestNo == model.RequestNo).FirstOrDefault();
            if (request == null)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "Request Not Found!", model.RequestNo));
            }

            requestNo = RequestMasterDLL.UpdateRequest(dbContext, model, request, items);

            if (requestNo != null)
            {

                msg = "Request No. " + requestNo + " has been updated!";
                return await Task.FromResult(new ResponseDTO(ResponseCode.OK, msg, requestNo));
            }
            else
            {
                msg = "There was an error saving the request";
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, requestNo));
            }
        }


        [HttpPost("UploadFiles"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFiles([Required] List<IFormFile> files, [FromForm] RequestFiles file)
        {
            var result = 0;
            using (var transaction = await dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var file_exists = dbContext.RequestFiles.Where(x => x.RequestNo == file.RequestNo && x.RequestTypeCode == file.RequestTypeCode && x.BranchCode == file.BranchCode).Select(x => new { x.Row }).OrderByDescending(x => x.Row).FirstOrDefault();

                    int ctr = 0;

                    if (file_exists != null)
                    {
                        ctr = file_exists.Row + 1;
                    }
                    foreach (var f in files)
                    {
                        byte[] image_stream = new byte[] { };
                        RequestFiles rfile = new RequestFiles();
                        rfile.RequestNo = file.RequestNo;
                        rfile.RequestTypeCode = file.RequestTypeCode;
                        rfile.BranchCode = file.BranchCode;
                        rfile.MimeType = f.ContentType;
                        rfile.FileName = f.FileName;
                        rfile.FileSize = f.Length;
                        rfile.Row = ctr++;

                        using (var stream = new MemoryStream())
                        {
                            await f.CopyToAsync(stream);
                            image_stream = stream.ToArray();
                            rfile.File = image_stream;
                        }

                        dbContext.RequestFiles.Add(rfile);
                    }
                    result = await dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    await transaction.DisposeAsync();
                }
            }

            return Ok(result);
        }

        [HttpGet("GetAttachments")]
        public async Task<object> Attachments([FromQuery] string requestTypeCode, [FromQuery] string requestNo, [FromQuery] string branchCode, [FromQuery] int row)
        {
            using (var transaction = dbContext.Database.BeginTransaction())
            {

                var data = new RequestFiles();
                try
                {
                    var img = dbContext.RequestFiles
                    .Where(x => x.RequestNo == requestNo && x.RequestTypeCode == requestTypeCode && x.BranchCode == branchCode && x.Row == row)
                    .Select(x => new { x.File, x.FileName, x.MimeType, x.FileSize }).AsNoTracking().SingleOrDefault();

                    return await Task.FromResult(Ok(img));
                }
                catch (Exception)
                {

                    transaction.Rollback();

                    throw;
                }

            }
        }

        [HttpPost("ApproveRequest")]
        public async Task<object> Approve([FromBody] ApproveRequestBindingModel md)
        {
            string msg = string.Empty;

            try
            {
                var request = dbContext.RequestMasters
                    .Where(x => x.RequestTypeCode == md.RequestTypeCode && x.BranchCode == md.BranchCode && x.RequestNo == md.RequestNo)
                    .FirstOrDefault();
                if (request == null)
                {
                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, "Request Not Found!", md.RequestNo));
                }

                var result = RequestMasterDLL.ApproveRequest(dbContext, md, request);

                if (result > 0)
                {
                    var type = md.Approved == "N" ? "Rejected" : "Approved";
                    msg = $"Request # {md.RequestNo} has been {type}!";
                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, msg, md.RequestNo));
                }
                else
                {
                    msg = "There was an error approving the request.";
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, md.RequestNo));
                }

            }
            catch (Exception ex)
            {
                msg = ex.InnerException.Message;
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, null));
            }


        }

        [HttpPost("ClosedRequest")]
        public async Task<object> Closed([FromBody] ApproveRequestBindingModel md)
        {
            string msg = string.Empty;

            try
            {
                var result = RequestMasterDLL.ClosedRequest(dbContext, md);

                if (result > 0)
                {

                    msg = "Request # " + md.RequestNo + " has been Closed!";
                    return await Task.FromResult(new ResponseDTO(ResponseCode.OK, msg, md.RequestNo));
                }
                else
                {
                    msg = "There was an error closing the request.";
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, md.RequestNo));
                }

            }
            catch (Exception ex)
            {
                msg = ex.InnerException.Message;
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, msg, null));
            }


        }


        [HttpGet("GetRequestsForApproval")]
        public async Task<object> RequestsForApproval([FromQuery] string user, [FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "")
        {
            try
            {
                var requests = RequestMasterDLL.GetRequestsForApprovalByApprover(dbContext, user, pageIndex, pageSize, search);


                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpGet("GetApprovedHistory")]
        public async Task<object> GetApprovedHistory([FromQuery] string type, [FromQuery] string user, [FromQuery] string branchCode, [FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "", [FromQuery] string requestTypeCode = "", [FromQuery] string closed = "")
        {
            try
            {
                var requests = RequestMasterDLL.GetApprovalHistory(dbContext, type, user, pageIndex, pageSize, search, requestTypeCode, closed, "approved");

                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpGet("GetRejectedHistory")]
        public async Task<object> GetRejectedHistory([FromQuery] string type, [FromQuery] string user, [FromQuery] string branchCode, [FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "", [FromQuery] string requestTypeCode = "", [FromQuery] string closed = "")
        {
            try
            {
                var requests = RequestMasterDLL.GetApprovalHistory(dbContext, type, user, pageIndex, pageSize, search, requestTypeCode, closed, "rejected");

                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpGet("ViewApprovedList")]
        public async Task<object> ViewApprovedList([FromQuery] string type, [FromQuery] string user, [FromQuery] string branchCode, [FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "", [FromQuery] string requestTypeCode = null, [FromQuery] string closed = "")
        {
            try
            {
                var requests = RequestMasterDLL.ViewApprovedList(dbContext, type, user, pageIndex, pageSize, search, requestTypeCode, closed, branchCode);

                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpGet("ViewADBDMApproves")]
        public async Task<object> ViewADBDMApproves([FromQuery] string type, [FromQuery] string user, [FromQuery] string branchCode, [FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search = "", [FromQuery] string requestTypeCode = null, [FromQuery] string closed = "")
        {
            try
            {
                var requests = RequestMasterDLL.ViewADBDMApprovedList(dbContext, type, user, pageIndex, pageSize, search, requestTypeCode, closed);

                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }


        [HttpGet("GetRequestDetails")]
        public async Task<object> RequestDetails([FromQuery] string requestNo, [FromQuery] string branchCode, [FromQuery] string requestTypeCode)
        {
            try
            {
                var requests = RequestMasterDLL.GetRequestDetails(dbContext, requestNo, branchCode, requestTypeCode);
                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpGet("GetRequestFiles")]
        public async Task<object> RequestFiles([FromQuery] string requestNo, [FromQuery] string branchCode, [FromQuery] string requestTypeCode)
        {
            try
            {
                var requests = RequestMasterDLL.GetRequestFiles(dbContext, requestNo, branchCode, requestTypeCode);
                return await Task.FromResult(requests);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }

        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile([FromQuery] string requestNo, [FromQuery] string branchCode, [FromQuery] string requestTypeCode, int row)
        {
            byte[] fileContent;
            string contentType = string.Empty;
            string fileName = string.Empty;

            using (var transaction = await dbContext.Database.BeginTransactionAsync())
            {

                //var data = new RequestFiles(); 
                try
                {
                    var data = dbContext.RequestFiles
                        .Where(x => x.RequestNo == requestNo && x.BranchCode == branchCode && x.RequestTypeCode == requestTypeCode && x.Row == row)
                        .AsNoTracking()
                        .SingleOrDefault();
                    fileContent = (byte[])data.File;
                    //fileContent = Convert.FromBase64String(Encoding.UTF8.GetString(data.File));
                    contentType = GetMIMEType(data.FileName);
                    fileName = data.FileName;

                }

                catch (Exception)
                {

                    await transaction.RollbackAsync();
                    throw;
                }
            }
            //var file = RequestMasterDLL.GetFile(dbContext, requestNo, branchCode, requestTypeCode, row);
            ////Response.Headers.Add("Content-Disposition", "attachment;filename=\""+file.FileName + "\"");
            fileName = fileName.Replace(",", "");
            //Response.Headers.Add("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            Response.Headers.Add("Content-Disposition", "attachment; filename=" + fileName);
            //return File(file.File, file.MimeType); 
            return new FileContentResult(fileContent, contentType);
        }
        private string GetMIMEType(string fileName)
        {
            var provider =
                new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(fileName, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }

        [HttpGet("CountPendingRequests")]
        public async Task<object> PendingRequests([FromQuery] string userName)
        {
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var count = RequestMasterDLL.CountRequestsForApprovalByApprover(dbContext, userName);

                    transaction.Commit();
                    transaction.Dispose();

                    return await Task.FromResult(count);



                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));

                }

            }
        }

        [HttpGet("ReferenceADB")]
        public async Task<object> ReferenceADB([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string branchCode = "", [FromQuery] string search = "")
        {
            try
            {
                var refNo = RequestMasterDLL.ADBNo(dbContext, pageIndex, pageSize, branchCode, search);

                return await Task.FromResult(refNo);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }


        [HttpGet("ReferenceRFP")]
        public async Task<object> ReferenceRFP([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string branchCode = "", [FromQuery] string search = "")
        {
            try
            {
                var refNo = RequestMasterDLL.RFPNo(dbContext, pageIndex, pageSize, branchCode, search);

                return await Task.FromResult(refNo);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.InnerException.Message, null));
            }
        }


        [HttpGet("GetAllLocations")]
        public async Task<object> GetAllLocations()
        {
            var response = ResponseCode.OK; string msg = ""; object dataset = null;
            try
            {
                List<VwSerialNoLocationCodes> lm = dbContext.VwSerialNoLocationCodes.OrderBy(x=>x.locationCode).ToList<VwSerialNoLocationCodes>();
                dataset = lm;
            }
            catch (Exception ex)
            {
                response = ResponseCode.Error;
                msg = ex.Message;
            }

            return await Task.FromResult(new ResponseDTO(response, msg, dataset));

        }

        [HttpGet("VerifySerialNoAvailability")]
        public async Task<ResponseDTO> VerifySerialNoAvailability([FromQuery] string itemCode, [FromQuery] string serialNo, [FromQuery] string locationCode="", [FromQuery] string supplierCode = "")
        {
            var response = ResponseCode.OK; string msg = ""; object dataset = null;

            IList<VwSerialNoMaster> sno = RequestMasterDLL.VerifySerialNoAvailability(dbContext, itemCode, serialNo);

            if (sno.Count <=0)
            {
                msg = "This serial number " + serialNo.Trim() + " is not found.";
                response = ResponseCode.Error;
            }
            else
            {
                if (sno[0].serialNoStatusCode.Trim() != "AV")
                {
                    msg = "This serial number " + serialNo.Trim() + " is no longer available, the current status is " + sno[0].serialNoStatusCode.Trim() + ".";
                    response = ResponseCode.Error;
                }

                if (sno[0].locationCode.Trim() != locationCode.Trim())
                {
                    msg = "This serial number " + serialNo.Trim() + " is currently in location " + sno[0].locationCode.Trim() + ".";
                    response = ResponseCode.Error;
                }

                if (sno[0].supplierCode.Trim() != supplierCode.Trim())
                {
                    msg = "This serial number " + serialNo.Trim() + " is currently in supplier " + sno[0].supplierCode.Trim() + ".";
                    response = ResponseCode.Error;
                }
            }

            return await Task.FromResult(new ResponseDTO(response, msg, dataset));
        }
    }

}
