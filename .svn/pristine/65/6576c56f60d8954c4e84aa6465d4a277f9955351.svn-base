using ReqApi.Models;
using ReqApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;

namespace ReqApi.DataLogic
{
    public class RequestTypeMasterDLL
    {
        public static List<RequestTypeMaster> RequestTypeMasterList(ReqappDBContext dbContext)
        {
            string sql = string.Format("Select * from requestTypeMaster");

            var list = dbContext.RequestTypeMasters
                  .FromSqlRaw(sql)
                  .ToList<RequestTypeMaster>();

            return list;
        }
        
    }
}
