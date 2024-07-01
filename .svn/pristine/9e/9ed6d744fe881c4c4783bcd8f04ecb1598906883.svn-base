using ReqApi.Models;
using ReqApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;
using ReqApi.DTO;

namespace ReqApi.DataLogic
{
    public class SupplierMasterDLL
    {

        public static string SupplierName(ReqappDBContext dbContext, string code)
        {
            var sname = dbContext.VwSupplierMasters.Where(w => w.SupplierCode == code).Select(w => w.Company).SingleOrDefault();

             return sname;       
         }
        public static object SupplierMasterList(ReqappDBContext dbContext, int pageIndex, int pageSize, string search, int limit)
        {
            var response = new object();
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT * FROM vw_supplierMaster ");

                    if (search != "")
                    {
                        sql = sql + String.Format("WHERE supplierCode LIKE '%{0}%' OR company LIKE '%{0}%' ", search);
                    }

                    var raw_data = dbContext.VwSupplierMasters
                        .FromSqlRaw(sql)
                        .OrderBy(c => c.Company)
                        .ToList().Take(limit);

                    var page = new PaginatedResponse<VwSupplierMaster>(raw_data, pageIndex, pageSize);

                    var totalCount = raw_data.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    response = new
                    {
                        Page = page,
                        TotalPages = totalPages
                    };

                    transaction.Commit();
                    transaction.Dispose();

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();

                    throw;
                }

            }


            

            return response;
        }
        
    }
}
