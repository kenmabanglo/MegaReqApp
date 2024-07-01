using ReqApi.Models;
using ReqApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;
using ReqApi.DTO;

namespace ReqApi.DataLogic
{
    public class ItemMasterDLL
    {
        public static object ItemMasterList(ReqappDBContext dbContext, int pageIndex, int pageSize, string search, int limit, string supplierCode)
        {
            string i = String.Empty;
            var response = new object();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT item.* FROM vw_itemMaster item ");

                    if (!String.IsNullOrEmpty(supplierCode))
                    {
                        sql += String.Format(" INNER JOIN vw_supplierItemsMaster sup ON sup.supplierCode = '{0}' and sup.itemCode = item.itemCode", supplierCode);
                    }

                    sql += " WHERE item.itemStatus <> 'INACTIVE' ";

                    if (search != null)
                    {
                        sql = sql + String.Format(" AND item.itemCode LIKE '%{0}%' OR item.itemName LIKE '%{1}%' ", search, search);
                    }

                    var raw_data = dbContext.VwItemMasters
                        .FromSqlRaw(sql)
                        .OrderBy(c => c.ItemName.Trim()).ThenByDescending(c => c.Price)
                        .ToList().Take(limit);

                    var page = new PaginatedResponse<VwItemMaster>(raw_data, pageIndex, pageSize);

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
