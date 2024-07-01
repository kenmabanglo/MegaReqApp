using Microsoft.EntityFrameworkCore;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;

namespace ReqApi.DataLogic
{
    public class TalentRequestMasterDLL
    {

        public static List<RequestReasonMaster> RequestReasonMasterList(ReqappDBContext dbContext)
        {
            List<RequestReasonMaster> list = new List<RequestReasonMaster>();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = string.Format("Select * from RequestReasonMaster");

                    list = dbContext.RequestReasonMasters
                          .FromSqlRaw(sql)
                          .ToList<RequestReasonMaster>();

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

        public static List<EmpStatusMaster> EmpStatusMasterList(ReqappDBContext dbContext)
        {
            List<EmpStatusMaster> list = new List<EmpStatusMaster>();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = string.Format("Select * from EmpStatusMaster");

                    list = dbContext.EmpStatusMasters
                          .FromSqlRaw(sql)
                          .ToList<EmpStatusMaster>();

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

        public static List<AllowancesMaster> AllowancesMasterList(ReqappDBContext dbContext)
        {
            List<AllowancesMaster> list = new List<AllowancesMaster>();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = string.Format("Select * from AllowancesMaster");

                    list = dbContext.AllowancesMasters
                          .FromSqlRaw(sql)
                          .ToList<AllowancesMaster>();

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

        

        public static List<BenefitsPackageMaster> BenefitsPackageMasterList(ReqappDBContext dbContext)
        {
            List<BenefitsPackageMaster> list = new List<BenefitsPackageMaster>();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = string.Format("Select * from BenefitsPackageMaster");

                    list = dbContext.BenefitsPackageMasters
                          .FromSqlRaw(sql)
                          .ToList<BenefitsPackageMaster>();

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