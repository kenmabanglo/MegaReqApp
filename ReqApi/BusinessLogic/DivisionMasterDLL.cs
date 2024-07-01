using ReqApi.Models;
using ReqApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;

namespace ReqApi.DataLogic
{
    
    public class DivisionMasterDLL
    {
        private readonly ReqappDBContext dbContext;

        public DivisionMasterDLL(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public static List<VwDivisionMaster> DivisionMasterList(ReqappDBContext dbContext)
        {
            List<VwDivisionMaster> list = new List<VwDivisionMaster> ();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = string.Format("Select * from vw_divisionMaster WHERE divisionName NOT IN ('TARLAC MAC ENTERPRISES, INC. (CONCEPCION)')");

                    list = dbContext.VwDivisionMasters
                          .FromSqlRaw(sql)
                          .ToList<VwDivisionMaster>();

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

        public static string BranchName(ReqappDBContext dbContext, string code)
        {
            //string sql = string.Format("Select * from vw_divisionMaster WHERE divisionCode = '{0}'", code);
             
            var division = dbContext.VwDivisionMasters
                    .Where(x=>x.DivisionCode == code)
                    .Select(x => x.DivisionName).FirstOrDefault();

            return division;
        }

    }
}
