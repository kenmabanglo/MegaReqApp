using ReqApi.Models;
using ReqApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;

namespace ReqApi.DataLogic
{
    
    public class DepartmentMasterDLL
    {
        private readonly ReqappDBContext dbContext;

        public DepartmentMasterDLL(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public static List<VwDepartmentMaster> DepartmentMasterList(ReqappDBContext dbContext)
        {
            List<VwDepartmentMaster> list = new List<VwDepartmentMaster> ();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = string.Format("Select * from vw_departmentMaster");

                    list = dbContext.VwDepartmentMasters
                          .FromSqlRaw(sql)
                          .ToList<VwDepartmentMaster>();

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

            return list;
        }
         

    }
}
