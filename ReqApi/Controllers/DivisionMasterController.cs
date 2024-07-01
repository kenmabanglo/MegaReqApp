using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReqApi.DataLogic;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Enums;

namespace ReqApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class DivisionMasterController : ControllerBase
    {
        private readonly ReqappDBContext dbContext;

        public DivisionMasterController(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("List")]
        public async Task<object> GetList()
        {
            try
            {

                var list = DivisionMasterDLL.DivisionMasterList(dbContext);

                return await Task.FromResult(list);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

    }

}
