using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReqApi.Models.Context;
using ReqApi.DataLogic;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class SysTransactionParamController : ControllerBase
    {
        private readonly ReqappDBContext dbContext;
        public SysTransactionParamController(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("GetDisplayCode/{reqType}/{branchCode}")]
        //[Authorize]
        public async Task<object> Get(string reqType, string branchCode)
        {
            var trx = SysTransactionParamDLL.GetNextTransactionNoWithNoLock(dbContext, reqType, branchCode);
            
            return await Task.FromResult(trx);
        }

    }
}
