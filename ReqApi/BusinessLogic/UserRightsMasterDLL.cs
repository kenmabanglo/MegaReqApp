using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;

namespace ReqApi.BusinessLogic
{
    public class UserRightsMasterDLL
    {
        public static object GetAllRightsByUser(ReqappDBContext dbContext, string userName)
        {
            var result = new object();
            var datas = new object(); string[] codes = new string[0];
            try
            {
                result = dbContext.UserRightsMasters
                    .Where(w => w.UserCode == userName)
                    .Select(x=>x.RightsCode)
                    .AsNoTracking()
                    .ToList();

            }
            catch (Exception)
            {

                throw;
            }
            

            return result;
        }


    }
}
