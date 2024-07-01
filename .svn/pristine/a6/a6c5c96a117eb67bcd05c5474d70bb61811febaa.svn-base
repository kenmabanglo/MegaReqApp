using ReqApi.Models;
using Microsoft.EntityFrameworkCore;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;

namespace ReqApi.DataLogic
{
    public class SysTransactionParamDLL
    {
        public static string GetNextTransactionNo(ReqappDBContext dbContext, string requestTypeCode, string branchCode, string currentUserName)
        {
            decimal ctr = 0;
            string itemCode = string.Empty;
            try
            {
                var sql = String.Format("UPDATE SysTransactionParam SET locked = 'Y', lockedBy = '{0}' WHERE RequestTypeCode = '{1}' and locked = 'N' and BranchCode = '{2}'", currentUserName, requestTypeCode, branchCode);
                dbContext.Database.ExecuteSqlRaw(sql);
                dbContext.SaveChanges();
                List<SysTransactionParam> trx = dbContext.SysTransactionParams.Where(s => s.Locked == "Y" && s.LockedBy == currentUserName && s.BranchCode == branchCode && s.RequestTypeCode == requestTypeCode).ToList();
                ctr = trx[0].LastNo;
                ctr++;
                itemCode = generateTransCode(requestTypeCode, ctr, branchCode);
            }
            catch (Exception)
            {
                dbContext.Database.CurrentTransaction.Rollback();
                throw;
            }

            return itemCode;
        }

        public static void SetNextTransactionNo(ReqappDBContext dbContext, string RequestTypeCode, string branchCode, string currentUserName)
        {
            try
            {
                var sql = String.Format("UPDATE SysTransactionParam SET locked = 'N', lockedBy = NULL, LastNo = LastNo + 1 " +
                     "WHERE RequestTypeCode = '{0}' and branchCode = '{1}' and lockedBy = '{2}' and locked = 'Y'",
                     RequestTypeCode, branchCode, currentUserName
                  );
                dbContext.Database.ExecuteSqlRaw(sql);
                dbContext.SaveChanges();
            }
            catch (Exception)
            {
                dbContext.Database.CurrentTransaction.Rollback();
                throw;
            }
        }

        // For display ID Code Only with No Lock Feature
        public static object GetNextTransactionNoWithNoLock(ReqappDBContext dbContext, string RequestTypeCode, string branchCode)
        {
            decimal ctr = 0;
            string itemCode = string.Empty;
            try
            {
                List<SysTransactionParam> trx = dbContext.SysTransactionParams.Where(s => s.RequestTypeCode == RequestTypeCode && s.BranchCode == branchCode).ToList();
                ctr = trx[0].LastNo;
                ctr = ctr + 1;
                itemCode = generateTransCode(RequestTypeCode, ctr, branchCode);

            }
            catch (Exception)
            {
                dbContext.Database.CurrentTransaction.Rollback();
                throw;
            }
            return itemCode;
        }

        private static string generateTransCode(string RequestTypeCode, decimal ctr, string branchCode)
        {
            string itemCode = string.Empty;
            string padding = "00000000"; //8
            itemCode = ctr.ToString(padding);

            return itemCode;
        }

        public static void UnlockTransactionNo(ReqappDBContext dBContext, string RequestTypeCode, string branchCode, string currentUserName)
        {
            try
            {
                dBContext.Database.ExecuteSqlRaw(@"UPDATE SysTransactionParam SET locked = 'N', lockedBy = '' WHERE RequestTypeCode = {0} and locked = 'Y' and branchCode = {1} and lockedBy = {2}", RequestTypeCode, currentUserName, branchCode);
                dBContext.SaveChanges();
            }
            catch
            {
                dBContext.Database.CurrentTransaction.Rollback();
                throw;
            }

            return;
        }

        public static void AddParam(ReqappDBContext dbContext, string branchCode, string currentUserName)
        {
            try
            {
                var sys = new SysTransactionParam();
                sys.LastNo = 0;
                sys.Locked = "N"; 
                sys.LockedBy = currentUserName;
                sys.BranchCode = branchCode;
                dbContext.SysTransactionParams.Add(sys);
                dbContext.SaveChanges();
            }
            catch
            {
                dbContext.Database.CurrentTransaction.Rollback();
                throw;
            }
            return;
        }
    }
}