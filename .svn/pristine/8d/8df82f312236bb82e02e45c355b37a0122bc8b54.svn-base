using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReqApi.DataLogic;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;
using ReqApi.Models.Enums;
using System.Dynamic;

namespace ReqApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ItemMasterController : ControllerBase
    {
        private readonly ReqappDBContext dbContext;

        public ItemMasterController(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }
 
        [HttpGet("List")]
        public async Task<object> GetList([FromQuery] int pageIndex, [FromQuery] int pageSize, [FromQuery] string search="", [FromQuery] int limit=100, [FromQuery] string supplierCode = "")
        {
            try
            {  

                var response = ItemMasterDLL.ItemMasterList(dbContext, pageIndex, pageSize, search, limit, supplierCode);

                return await Task.FromResult(response);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

    }

}
