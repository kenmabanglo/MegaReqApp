﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;
using System.Globalization;
using System.Linq;

namespace ReqApi.DataLogic
{
    public class UserMasterDLL
    {
        public static UserSetting GetUserSettings(ReqappDBContext dbContext, string userName)
        {

            var user = dbContext.UserSettings
                  .Where(x => x.UserName == userName)
                  .FirstOrDefault();
            user.BranchName = DivisionMasterDLL.BranchName(dbContext, user.BranchCode);

            return user;
        }
         

        public static string GetName(ReqappDBContext dbContext, string userName)
        {
            if (string.IsNullOrEmpty(userName))
                return null;

            var user = dbContext.UserSettings
                  .Where(x => x.UserName == userName.Trim())
                  .FirstOrDefault();

            return user?.FullName.Trim();
        }

        public static object GetAllPositionRanks(ReqappDBContext dbContext)
        {

            var ranks = dbContext.UserSettings 
                .FromSqlRaw("SELECT positionRank FROM UserSettings WHERE positionRank NOT IN ('NULL','President','Vice President','AVP, Audit','AVP') GROUP BY positionRank")
                .Select(x=>x.PositionRank.Trim())
                .ToList(); 

            return ranks;
        }

        public static object GetAllUserSettingsByBranch(ReqappDBContext dbContext, string branchCode, int pageIndex, int pageSize, string search, string userName, string positionName)
        {
            if (userName == null) userName = "";
            string sql = String.Format("SELECT * FROM UserSettings WHERE userName <> '{0}'", userName.Trim());

            if (branchCode != null)
            {
                if (branchCode == "NO BRANCH") branchCode = "";
                sql = sql + String.Format(" AND branchCode = '{0}'", branchCode);
            }

            if (search != null)
            {
                sql = sql + String.Format(" AND (userName LIKE '%{0}%' OR branchCode LIKE '%{0}%' OR positionName LIKE '%{0}%' OR fullName LIKE '%{0}%' OR positionRank LIKE '%{0}%') ", search);
            }
             
            sql = sql + String.Format(" ORDER BY userName ASC");

            var raw_data = dbContext.UserSettings.FromSqlRaw(sql).ToList();

            var users = raw_data.Select(x => new UserSelectDTO(x.UserName, x.BranchCode, x.PositionName, x.FullName + (x.Active == 0? "-INACT":(x.Active == 3?"-DEACT":"")), x.Active)).ToList();

            var page = new PaginatedResponse<UserSelectDTO>(users, pageIndex, pageSize);

            var totalCount = raw_data.Count();
            var totalPages = Math.Ceiling((double)totalCount / pageSize);

            var response = new
            {
                Page = page,
                TotalPages = totalPages
            };

            return response;
        }

        // Ken
        public static object GetAllBranch(ReqappDBContext dbContext, int pageIndex, int pageSize, string search)
        {
            string sql = String.Format("SELECT * FROM vw_divisionMaster");
            if(search != null)
            {
                sql = sql + String.Format(" WHERE divisionCode LIKE '%{0}%' OR divisionName LIKE '%{0}%'", search);
            }
            sql = sql + String.Format(" ORDER BY divisionCode ASC");

            var raw_data = dbContext.VwDivisionMasters.FromSqlRaw(sql).ToList();

            var branches = raw_data.Select(x => new BranchSelectDTO(x.DivisionCode, x.DivisionName));

            var page = new PaginatedResponse<BranchSelectDTO>(branches, pageIndex, pageSize);

            var totalCount = raw_data.Count();
            var totalPages = Math.Ceiling((double)totalCount / pageSize);

            var response = new
            {
                Page = page,
                TotalPages = totalPages
            };

            return response;
        }

        public static object GetAllApproversByBranchOrDistrict(ReqappDBContext dbContext, string branchCode, int pageIndex, int pageSize, string search, string userName, string positionName, int approverNum, string reqType, decimal estimatedAmt)
        {
            if (userName == null) userName = "";
            string approvers = ""; string ware_approvers = "";
            string approvers2 = "";//dm 
            string approvers3 = "";//corpo
            string sql_union = "";
            string sql_union2 = "";
            string bcode = branchCode;
            List<string> rtypes1 = new List<string>(new string[] { "RFA", "RFS", "RTO", "RS" });
            List<string> rtypes2 = new List<string>(new string[] { "RFP", "ADB" });

            string sql = String.Format("SELECT us.* FROM UserSettings us " +
                "WHERE us.userName <> '{0}' AND active = 1 ", userName.Trim());
            sql_union += sql; sql_union2 += sql;

            positionName = positionName.Trim().ToLower();

            // IMMEDIATE HEAD (RFS,RFA, RS, RTO)
            if (rtypes1.Contains(reqType))
            {
                //MGRS-HEAD-SUPERVISOR
                if (positionName.Contains("supervisor") || positionName.Contains("manager") || positionName.Contains("head"))
                {
                    approvers += " CONTAINS(us.positionName, '\"avp\" AND NOT \"audit\"') ";

                    approvers += " \"supervisor*\" OR (\"manager*\" AND NOT \"district*\") OR \"head*\"";
                    approvers2 += " NEAR(\"manager*\",\"district\") ";
                }
                //OFFICERS-IC-SC-CASHIERS-DRIVERS
                else
                {
                    //warehouse asst
                    if (positionName.Contains("warehouse assistant"))
                    {
                        if (branchCode == "MAC")
                        {
                            //ware_approvers += " userName = 'ghing' ";
                            ware_approvers += " userName = 'tina' ";

                            branchCode = "";
                        }
                        else if (branchCode == "KAP")
                        {
                            ware_approvers += " userName = 'tina' OR userName = 'elma' ";
                            branchCode = "";
                        }
                    }
                    else
                    {
                        approvers += " \"supervisor*\" OR (\"manager*\" AND NOT \"district*\") OR \"head*\"";
                    }
                }
            }
            else if (rtypes2.Contains(reqType))
            {
                if (estimatedAmt <= 20000)
                {
                    // MGR1
                    if (approverNum == 1)
                    {

                        approvers += " us.positionName LIKE '%manager 2%' ";// backup in case branch has no mgr1
                        approvers += " OR us.positionName LIKE '%head%' ";

                        if (positionName.Contains("manager") || positionName.Contains("supervisor"))
                        {
                            approvers2 += " us.positionName LIKE '%district manager%' ";
                        }
                        else
                        {
                            approvers += " OR (us.positionName LIKE '%manager%'  AND us.positionName NOT LIKE '%district manager%') ";
                        }
                    }
                    //MGR2/DM/EXEC
                    else if (approverNum == 2)
                    {
                        approvers += " us.positionName LIKE '%manager 2%' ";
                        //dm
                        approvers2 += " us.positionName LIKE '%district manager%' ";

                        //corpo
                        approvers3 += " us.positionName LIKE 'corporate sales manager' ";
                        approvers3 += " OR (us.positionName LIKE '%executive%' AND us.positionName NOT LIKE '%account executive%') ";
                    }
                }
                else if (estimatedAmt > 20000 && estimatedAmt <= 50000)
                {
                    //MGR2/DM
                    if (approverNum == 1)
                    {
                        // backup // approvers += " (us.positionName LIKE '%manager%'  AND us.positionName NOT LIKE '%district manager%')";
                        approvers += " us.positionName LIKE '%manager 2%' ";
                        //dm
                        approvers2 += " us.positionName LIKE '%district manager%' ";
                        //corpo
                        approvers3 += " us.positionName LIKE 'corporate sales manager' ";
                    }
                    //EXEC
                    else if (approverNum == 2)
                    {
                        //approvers3 += " (us.positionName LIKE '%executive%' AND us.positionName NOT LIKE '%account executive%') ";
                        //approvers += " (\"executive*\" AND NOT \"account\") ";
                        approvers3 += " (us.positionName LIKE '%executive%' AND us.positionName NOT LIKE '%account executive%') ";
                    }
                }
                else if (estimatedAmt > 50000 && estimatedAmt <= 200000)
                {
                    //EXEC
                    if (approverNum == 1)
                    {
                        //approvers += " (\"executive*\" AND NOT \"account\") ";
                        approvers3 += " (us.positionName LIKE '%executive%' AND us.positionName NOT LIKE '%account executive%') ";
                    }
                    //AVP/VP
                    else if (approverNum == 2)
                    {
                        approvers += " CONTAINS(us.positionName, '\"avp\" AND NOT \"audit\"') ";
                        //approvers += " (us.positionName LIKE '%AVP%' AND us.positionName NOT LIKE '%AVP, Audit%') ";
                        approvers += " OR us.positionName LIKE 'vp%' ";
                        approvers += " OR us.positionName LIKE '%vice president%' ";
                        approvers += " OR us.positionName LIKE '%president%' ";
                        branchCode = "";
                        //approvers += " (\"avp\" AND NOT \"audit\") OR \"vp\" OR (\"vice\" AND NOT \"president\") ";
                    }
                }
                else //(estimatedAmt > 200000)
                {
                    //AVP
                    if (approverNum == 1)
                    {
                        //approvers += " (us.positionName LIKE '%AVP%' AND us.positionName NOT LIKE '%AVP, Audit%') ";
                        approvers += " CONTAINS(us.positionName, '\"avp\" AND NOT \"audit\"') ";
                        // approvers += " (\"avp\" AND NOT \"audit\")";
                        branchCode = "";

                    }
                    //VP/PRES
                    else if (approverNum == 2)
                    {
                        // approvers += " \"vp\" OR \"president\" ";
                        approvers += " us.positionName LIKE 'vp%' ";
                        approvers += " OR us.positionName LIKE '%vice president%' ";
                        approvers += " OR us.positionName LIKE '%president%' ";
                        branchCode = "";
                    }
                }
            }

            if (approvers != "" || approvers2 != "" || approvers3 != "")
            {
                //ADB,RFP
                if (rtypes2.Contains(reqType))
                {
                    if (approvers != "")
                    {
                        sql = sql + String.Format(" AND (" + approvers + ")");
                    }

                    if (approvers2 != "")
                    {
                        sql_union += String.Format(" AND (" + approvers2 + ")");
                    }
                    // corpo
                    if (approvers3 != "")
                    {
                        sql_union2 += String.Format(" AND (" + approvers3 + ")");
                    }
                }
                //OTHERS
                else
                {
                    if (approvers != "")
                    {
                        sql = sql + String.Format(" AND CONTAINS(us.positionName,'{0}') ", approvers);
                    }

                    if (approvers2 != "")
                    {
                        sql_union += String.Format(" AND CONTAINS(us.positionName,'{0}') ", approvers2);
                    }

                    if (ware_approvers != "")
                    {

                    }
                }

            }

            // STOREBASED
            if (rtypes1.Contains(reqType))
            {
                string userStoreBased = dbContext.UserSettings.Where(x => x.UserName == userName).Select(x => x.StoreBased).FirstOrDefault();

                if (userStoreBased != null)
                {
                    string store = String.Format(" AND storeBased = '{0}'", userStoreBased);
                    sql += store;
                    sql_union += store;
                }
            }

            if (branchCode != null)
            {
                if (branchCode == "NO BRANCH")
                {
                    branchCode = "";
                }

                if (approvers2 != "")
                {
                    //filter out DM's
                    sql_union += " AND us.userName = (select ub.userName from UserBranchMasters ub where ub.branchCode = '" + bcode + "')";
                }

                if (ware_approvers != "")
                {
                    //sql_union += 
                }

                if (branchCode != "")
                    sql += String.Format(" AND us.branchCode = '{0}'", branchCode);

            }

            if (search != null && search != "")
            {
                string t = String.Format(" AND (us.userName LIKE '%{0}%' OR us.branchCode LIKE '%{0}%' OR us.positionName LIKE '%{0}%' OR us.fullName LIKE '%{0}%') ", search);
                sql += t;
            }

            if (approvers2 != "" && approvers != "")
            {
                sql_union = " UNION " + sql_union;
                sql += sql_union;
            }

            if (approvers2 != "" && approvers == "")
            {
                //sql_union = " UNION " + sql_union;
                sql = sql_union;
            }


            if (approvers3 != "" && approvers != "")
            {
                sql_union2 = " UNION " + sql_union2;
                sql += sql_union2;
            }

            if (approvers == "")
            {
                // if executive lang scenario
                if (approvers3 != "")
                    sql = sql_union2;
                // if warehouse asst
                if (ware_approvers != "")
                    sql += " AND " + ware_approvers;
            }

            sql = sql + String.Format(" ORDER BY us.userName ASC");

            var raw_data = dbContext.UserSettings.FromSqlRaw(sql).ToList();

            var users = raw_data.Select(x => new UserSelectDTO(x.UserName, x.BranchCode, x.PositionName, x.FullName, x.Active)).ToList();

            var page = new PaginatedResponse<UserSelectDTO>(users, pageIndex, pageSize);

            var totalCount = raw_data.Count();
            var totalPages = Math.Ceiling((double)totalCount / pageSize);

            var response = new
            {
                Page = page,
                TotalPages = totalPages
            };

            return response;
        }

        public static List<UserSetting> GetInitialApprover(ReqappDBContext dBContext, string branchCode, int pageIndex, int pageSize, string search, string userName, string positionName, int approverNum, string reqType, decimal estimatedAmt)
        {
            var approvals = new List<UserSetting>();

            using (var db = dBContext)
            {
                using (var dbContextTransaction = db.Database.BeginTransaction())
                {

                    try
                    {
                        if (userName == null) userName = "";

                        string sql = ""; string select = "";

                        List<string> request_wo_cost = new List<string>(new string[] { "RTO", "RS", "RFS" });
                        List<string> request_w_cost = new List<string>(new string[] { "RFP", "ADB", "RFA","FL" });

                        var userSettings = dBContext.UserSettings.Where(x => x.UserName == userName).Select(x => new { x.PositionRank, x.StoreBased }).FirstOrDefault();

                        if (userSettings == null) return null;

                        string rank = userSettings.PositionRank != null ? userSettings.PositionRank.Trim() : "";
                        string position = positionName != null ? positionName.Trim().ToLower() : "";

                        var matrix = new List<string>();
                        
                        string managers = ""; string district = ""; string cnc = ""; string no_branches = ""; string corpo = "";

                        select = String.Format("SELECT * FROM UserSettings " +
                            "WHERE userName <> '{0}' AND active = 1 ", userName.Trim());

                        // ALL 
                        if (request_wo_cost.Contains(reqType) || (request_w_cost.Contains(reqType) && approverNum == 1))
                        {
                            if (rank == "")
                            {
                                // if store based check if mgr exists else get dm
                                if (userSettings.StoreBased == "Y")
                                {
                                    var branch_mgrs = dBContext.UserSettings.FromSqlRaw(String.Format("SELECT * FROM UserSettings WHERE branchCode = '{0}' AND positionRank = 'Manager 1' AND userName <> '{1}' AND active = 1", branchCode, userName)).Count();

                                    if (branch_mgrs > 0)
                                    {
                                        managers = "Manager 1";
                                    }
                                    else
                                    {
                                        district = "'District Manager'";
                                    }
                                }
                                else
                                {
                                    managers = "Manager 1','Manager 2";
                                }


                            }
                            else if (rank == "Manager 1")
                            {
                                // branch m2
                                managers = "Manager 2";

                                if (userSettings.StoreBased == "Y")
                                {
                                    // get all M1
                                    var branch_mgrs = dBContext.UserSettings.FromSqlRaw(
                                        String.Format("SELECT * FROM UserSettings WHERE branchCode = '{0}' AND " +
                                        "positionRank = 'Manager 1'  AND positionName NOT LIKE '%supervisor%' " +
                                        "AND userName <> '{1}' AND active = 1 AND storebased = 'Y' ",
                                        branchCode, userName)).Count();
                                    // co-M1
                                    if (branch_mgrs > 0 && (((position.Contains("supervisor") && position != "admin supervisor")) || position.Contains("head")))
                                    {
                                        managers = "Manager 1";
                                        district = "'District Manager'";
                                    }
                                    else if (branch_mgrs == 0)
                                    {
                                        district = "'District Manager'";
                                    }
                                    else
                                    {
                                        district = "'District Manager'";
                                    }

                                    // cnc mgr
                                    if (position.ToLower().Contains("cnc"))
                                    {
                                        cnc = "'CNC Manager'"; managers = ""; district = "";
                                    }


                                }

                            }
                            else if (rank == "Manager 2")
                            {
                                if (userSettings.StoreBased == "N")
                                    no_branches = "'Executive'";
                                else if (position.ToLower().Contains("cnc"))
                                    no_branches = "'Vice President'";
                                else
                                    no_branches = "'AVP'";
                                // district = "'District Manager'";
                            }
                            else if (rank == "District Manager")
                            {
                                // no_branches = "'Executive','AVP'";
                                no_branches = "'AVP'";
                            }
                            else if (rank == "Executive")
                            {
                                no_branches = "'AVP','Vice President'";
                            }
                            else if (rank == "AVP")
                            {
                                no_branches = "'Vice President'";
                            }

                            // SQL SCRIPTS -----------------------------------------------

                            // 1 branch
                            sql += select +
                                String.Format(" AND positionRank IN ('{0}') AND branchCode = '{1}' AND storeBased = '{2}' ",
                                managers, branchCode, userSettings.StoreBased);

                            // multi branch - DM 
                            if (district != "" && userSettings.StoreBased == "Y")
                            {
                                var branch_dm = dBContext.UserBranchMasters.FromSqlRaw(String.Format("SELECT * FROM UserBranchMasters WHERE branchCode = '{0}' AND DateAdd IS NULL ", branchCode))
                                                .Select(b => b.UserName).Single();

                                sql += "UNION " +
                                    select + String.Format(" AND UserName = '{0}' ", branch_dm);
                            }

                            // no branches
                            //executive, avp, vp, corpo m2
                            if (no_branches != "")
                            {
                                sql += "UNION " +
                                   select + String.Format(" AND positionRank IN ({0}) ", no_branches);
                            }

                            // CNC - M2
                            if (cnc != "")
                            {
                                // get cnc manager
                                var cnc_mgr = db.UserBranchMasters.FromSqlRaw(String.Format("SELECT * FROM UserSettings WHERE positionName = 'CNC Manager' "))
                                                .Select(b => b.UserName).Single();

                                sql += "UNION " +
                                    select + String.Format(" AND UserName = '{0}' ", cnc_mgr);
                            }


                            string override_specific_approver = null;

                            /// new overrides from database
                            //var custom_approvers = db.UserApprovers.AsNoTracking().AsEnumerable();

                            var branchCheck = db.UserApprovers
                                .Where(x => x.BranchCode.Trim() == branchCode.Trim() && x.UserName == "")
                                .ToList();

                            if (branchCheck.Count > 0)
                            {
                                int ctr = 0;
                                foreach (var branch in branchCheck)
                                {
                                    var condition = ctr == 0 ? " AND" : " OR";

                                    if (branch.PositionName.Trim() != "" && position.ToLower().Trim().Contains(branch.PositionName.ToLower().Trim()))
                                    {
                                        override_specific_approver += condition + " userName = '" + branch.ApproverUserName.Trim() + "'";
                                        ctr++;
                                    }
                                    else if (branch.PositionName.Trim() == "")
                                    {
                                        override_specific_approver += condition + " userName = '" + branch.ApproverUserName.Trim() + "'";
                                        ctr++;
                                    }

                                }
                            }

                            var positionCheck = db.UserApprovers
                                .Where(x => x.PositionName != "" && position.ToLower().Trim().Contains(x.PositionName.ToLower().Trim()) && x.BranchCode == "" && x.UserName == "")
                                .ToList();

                            if (positionCheck.Count > 0)
                            {
                                int ctr = 0;
                                foreach (var pos in positionCheck)
                                {
                                    var condition = ctr == 0 ? " AND" : " OR";
                                    override_specific_approver += condition + " userName = '" + pos.ApproverUserName.Trim() + "'";
                                    ctr++;
                                }
                            }

                            var userNameCheck = db.UserApprovers
                               .Where(x => x.UserName.Trim() == userName.Trim())
                               .ToList();

                            if (userNameCheck.Count > 0)
                            {
                                int ctr = 0;
                                foreach (var user in userNameCheck)
                                {
                                    var condition = ctr == 0 ? " AND" : " OR";
                                    override_specific_approver += condition + " userName = '" + user.ApproverUserName.Trim() + "'";
                                    ctr++;
                                }
                            }

                            // end overrides
                             

                            // override_specific_approver
                            if (override_specific_approver != null)
                            {
                                //sql = select + override_specific_approver;
                                //sql += select + override_specific_approver;
                                //sql += " UNION ";

                                sql = select + override_specific_approver;
                            }

                            // execute command
                            approvals = db.UserSettings.FromSqlRaw(sql)
                                 .ToList<UserSetting>();

                        }

                        dbContextTransaction.Commit();
                        dbContextTransaction.Dispose();
                    }
                    catch (Exception ex)
                    {
                        dbContextTransaction.Commit();
                        dbContextTransaction.Dispose();
                        throw ex;
                    }
                }
            }
            return approvals;
        }

        public static string AssignApproverToUser(ReqappDBContext dBContext, UserApprover model)
        {
            string tranId = String.Empty;
          
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                try
                {
                    var exists = dBContext.UserApprovers
                        .Where(x => x.UserName == model.UserName && x.ApproverUserName == model.ApproverUserName && x.BranchCode == model.BranchCode && x.PositionName.Trim().ToLower() == model.PositionName.Trim().ToLower())
                        .FirstOrDefault();
                    if (exists != null)
                    {
                        exists.ApproverUserName = model.ApproverUserName;
                        exists.BranchCode = model.BranchCode;
                        exists.PositionName = model.PositionName;

                        dBContext.Entry(exists).State = EntityState.Modified;
                        
                        tranId = exists.TranId.ToString();
                    }
                    else
                    {

                        var uapp = new UserApprover();
                        uapp.TranId = Guid.NewGuid();
                        uapp.UserName = model.UserName;
                        uapp.ApproverUserName = model.ApproverUserName;
                        uapp.BranchCode = model.BranchCode;
                        uapp.PositionName = model.PositionName;
                        uapp.UserAdd = model.UserAdd;
                        uapp.Created = DateTime.Now;

                        dBContext.UserApprovers.Add(uapp);

                        tranId = uapp.TranId.ToString();
                    }


                    dBContext.SaveChanges();
                    transaction.Commit();
                    transaction.Dispose();
                     
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    throw ex;
                } 
            }

            return tranId;
        }

        // Ken 
        public static string AddUserBranch(ReqappDBContext dBContext, UserBranchMaster model)
        {
            string userName = String.Empty;

            using (var transaction = dBContext.Database.BeginTransaction())
            {
                try
                {
                    var exists = dBContext.UserBranchMasters.Where(x => x.UserName == model.UserName && x.BranchCode == model.BranchCode).FirstOrDefault();
                    if (exists != null)
                    {
                        exists.UserName = model.UserName;
                        exists.BranchCode = model.BranchCode;

                        dBContext.Entry(exists).State = EntityState.Modified;

                        userName = exists.UserName.ToString();
                    } else
                    {
                        var ubm = new UserBranchMaster();
                        ubm.UserName = model.UserName;
                        ubm.BranchCode = model.BranchCode;

                        dBContext.UserBranchMasters.Add(ubm);

                        userName = ubm.UserName.ToString();
                    }

                    dBContext.SaveChanges();
                    transaction.Commit();
                    transaction.Dispose();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    transaction.Dispose();
                    throw ex;
                }
            }
            return userName;
        }
        public static List<UserSetting> GetNextOrFinalApprover(ReqappDBContext dBContext, string branchCode, int pageIndex, int pageSize, string search, string userName, string positionName, int approverNum, string reqType, decimal estimatedAmt)
        {
            if (userName == null) userName = "";
            string sql = ""; string select = "";

            var userSettings = dBContext.UserSettings.Where(x => x.UserName == userName).Select(x => new { x.PositionRank, x.StoreBased }).FirstOrDefault();
            string rank = userSettings.PositionRank != null ? userSettings.PositionRank.Trim() : "";

            if (userSettings == null) return null; 
            var approvals = new List<UserSetting>();

            List<string> no_branch_positions = new List<string>(new string[] {
                "District Manager",
                "Corporate Sales Manager 2",
                "Vice President",
                "President",
                "Executive",
                "AVP"
            });
             
            string exclude = "";
            if (rank == "Manager 2" || rank == "District Manager")
            {
                exclude = "'Manager 1','Manager 2'";
            }
            else if (rank == "Executive")
            {
                exclude = "'Manager 1','Manager 2','District Manager'";
            }
            else if (rank == "AVP" || rank == "AVP,Audit")
            {
                exclude = "'Manager 1','Manager 2','District Manager','Executive'";
            }
            else
            {

            }

            string position_rank = exclude != "" ? " AND ( positionRank NOT IN(" + exclude + ") OR positionRank IS NULL)" : "";

            //string app = approverNum == 1 ? " AND Approver1 = 'Y' " : " AND Approver2 = 'Y' ";

            string sql1 = String.Format("SELECT * FROM UserApprovalMatrix WHERE {0} BETWEEN limitFrom AND limitTo {1}", estimatedAmt, position_rank);

            var matrix = dBContext.UserApprovalMatrix.FromSqlRaw(sql1)
                .Select(x => x.PositionName.Trim()).ToList();

            select = String.Format("SELECT * FROM UserSettings WHERE active = 1 AND userName <> '{0}' ", userName);

            // get users with specified positions
            if (matrix != null)
            {
                string positions = String.Join("','", matrix.Where(s => !no_branch_positions.Contains(s)).ToList());

                // 1 branch
                sql += select + String.Format(" AND positionName IN ('{0}') AND branchCode = '{1}' AND storeBased = '{2}'", positions, branchCode, userSettings.StoreBased);

                // multi branch - DM
                var dm = matrix.Where(s => s == no_branch_positions[0]).SingleOrDefault();
                if (dm != null)
                {
                    var branch_dm = dBContext.UserBranchMasters.FromSqlRaw(String.Format("SELECT * FROM UserBranchMasters WHERE branchCode = '{0}'  AND DateAdd IS NULL ", branchCode))
                                    .Select(b => b.UserName).Single();

                    sql += " UNION " +
                        select + String.Format(" AND UserName = '{0}' ", branch_dm);
                }

                // corporates/execs/avp/vp/p
                positions = String.Join("','", matrix.Where(s => no_branch_positions.Skip(1).ToArray().Contains(s)).ToList());

                sql += " UNION " +
                   select + String.Format(" AND positionName IN ('{0}') ", positions);
                 

                approvals = dBContext.UserSettings.FromSqlRaw(sql)
                     .ToList<UserSetting>();

            }

            return approvals;

        }

        public static object GetAllUserSettings(ReqappDBContext dbContext, int pageIndex, int pageSize, string search)
        {
            var response = new object();
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT * FROM UserSettings WHERE active = 1");

                    if (search != "")
                    {
                        sql = sql + String.Format(" AND (userName LIKE '%{0}%' OR fullName LIKE '%{0}%'  OR positionName LIKE '%{0}%'  OR positionRank LIKE '%{0}%') ", search);
                    }

                    sql = sql + String.Format(" ORDER BY userName ASC");

                    var raw_data = dbContext.UserSettings.FromSqlRaw(sql).ToList();

                    var page = new PaginatedResponse<UserSetting>(raw_data, pageIndex, pageSize);

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

        public static object GetAllUserApprovers(ReqappDBContext dbContext, int pageIndex, int pageSize, string search, string userName)
        {
            var response = new object();
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT * FROM UserSettings WHERE active = 1 and positionRank IS NOT NULL");

                    if (search != "")
                    {
                        sql = sql + String.Format(" AND (userName LIKE '%{0}%' OR fullName LIKE '%{0}%'  OR positionName LIKE '%{0}%'  OR positionRank LIKE '%{0}%') ", search);
                    }

                    if (userName != "")
                    {
                        sql += String.Format("and userName <> '{0}'",userName);
                    }

                    sql = sql + String.Format(" ORDER BY userName ASC");

                    var raw_data = dbContext.UserSettings.FromSqlRaw(sql).ToList();

                    var page = new PaginatedResponse<UserSetting>(raw_data, pageIndex, pageSize);

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

        public static object GetAllInactiveUsers(ReqappDBContext dbContext, int pageIndex, int pageSize, string search)
        {
            var response = new object();
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {

                    string sql = String.Format("SELECT * FROM UserSettings WHERE active = 0 ");

                    if (search != "")
                    {
                        sql = sql + String.Format(" AND userName LIKE '%{0}%'", search);
                    }

                    sql = sql + String.Format(" ORDER BY Created DESC");

                    var raw_data = dbContext.UserSettings.FromSqlRaw(sql).ToList();

                    var page = new PaginatedResponse<UserSetting>(raw_data, pageIndex, pageSize);

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
                return response;

            }


        }

        public static int CountAllInactiveUsers(ReqappDBContext dbContext)
        {

            string sql = String.Format("SELECT * FROM UserSettings WHERE active = 0 ");

            var count = dbContext.UserSettings.FromSqlRaw(sql).Count();

            return count;
        }

        public static UserSetting GetUserBranch(ReqappDBContext dbContext, string userName)
        {

            var user = dbContext.UserSettings 
                  .Where(x => x.UserName == userName) 
                  .FirstOrDefault();
           

            user.UserBranches = dbContext.UserBranchMasters.Where(b => b.UserName == userName)
                            .ToList(); 
                
            return user; 
        }

        public static bool IsUserDistrictManager(ReqappDBContext dbContext, string userName)
        {

            var user = dbContext.UserSettings
                  .Where(x => x.UserName == userName && x.PositionName.ToLower().Contains("district"))
                  .Single();
            return user != null;
            //return user[0].BranchCode;
        }

        // Ken 
        public static object GetUserApprover(ReqappDBContext dbContext, string userName)
        {
            string ToProperCase(string text)
            {
                if (string.IsNullOrWhiteSpace(text))
                    return string.Empty;

                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
                return textInfo.ToTitleCase(text.ToLower());
            }

            object response = null;

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try 
                {
                    string sql = String.Format("SELECT ua.tranId, ua.userName, us.fullName, us.positionName, us.branchCode, "
                        + "ua.approverUserName, uas.fullName AS approverFullName, uas.positionName AS approverPositionName, "
                        + "uas.branchCode AS approverBranchCode, ua.userAdd, uas1.fullName AS userAddFullName, ua.created "
                        + "FROM UserApprovers ua "
                        + "INNER JOIN UserSettings us ON us.userName = ua.userName "
                        + "INNER JOIN UserSettings uas ON uas.userName = ua.approverUserName "
                        + "INNER JOIN UserSettings uas1 ON uas1.userName = ua.userAdd "
                        + "WHERE ua.userName = '{0}' ORDER BY ua.created ASC", userName.Trim());

                    var raw_data = dbContext.VwCurrentUserApproverMasters.FromSqlRaw(sql).ToList();

                    //response = raw_data.FirstOrDefault();
                    response = raw_data.Select(x => new
                    {
                        tranId = x.TranId,
                        approverUserName = x.ApproverUserName.Trim(),
                        approverFullName = ToProperCase(x.ApproverFullName.Trim()),
                        approverPositionName = ToProperCase(x.ApproverPositionName.Trim()),
                        approverBranchCode = x.ApproverBranchCode.Trim(),
                        userAddFullName = ToProperCase(x.UserAddFullName.Trim()),
                        created = x.Created

                    }).ToList();

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

        public static object GetCurrentUserBranch(ReqappDBContext dbContext, string userName)
        {

            object response = null;

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT * FROM vw_currentUserBranchMaster WHERE userName = '{0}'", userName.Trim());

                    var raw_data = dbContext.VwCurrentUserBranchMasters.FromSqlRaw(sql).ToList();

                    //response = raw_data.FirstOrDefault();
                    response = raw_data.Select(x => new
                    {
                        userName = x.UserName.Trim(),
                        branchCode = x.BranchCode.Trim(),
                        divisionName = x.DivisionName.Trim(),
                        dateAdd = x.DateAdd
                    }).ToList();

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

        //public static object GetCurrentUserBranch(ReqappDBContext dbContext, string userName)
        //{
        //    object response = null;
        //    using (var transaction = dbContext.Database.BeginTransaction())
        //    {
        //        try
        //        {
        //            string sql = String.Format("SELECT * FROM vw_currentUserBranchMaster WHERE userName = '{0}'", userName.Trim());
        //            var raw_data = dbContext.VwCurrentUserBranchMasters.FromSqlRaw(sql).ToList();

        //            response = raw_data.Select( x => new
        //            {
        //                userName = x.UserName,
        //                branchCode = x.BranchCode,
        //                branchName = x.DivisionName,
        //                dateAdd = x.DateAdd

        //            }).ToList();

        //            transaction.Commit();
        //            transaction.Dispose();

        //        }
        //        catch (Exception ex) 
        //        { 
        //            transaction.Rollback(); 
        //            transaction.Dispose(); 
        //            throw; 
        //        }

        //    }
        //    return response;

        //}
        // old overrides do not delete
        ///
        // ////--to reach maam neth
        //if (userName == "friezel") no_branches = "'Executive'";
        //////--to reach maam jean
        //else if (userName == "moquindo") corpo = "Manager 2";

        //if (positionName.Contains("Account Executive")) corpo = "Manager 2"; //jean              



        //if (position.Contains("warehouse assistant"))
        //{
        //    if (branchCode == "MAC")
        //    {
        //        //override_specific_approver += " AND userName = 'ghing' ";
        //        override_specific_approver += " AND userName = 'tina' "; 
        //    }
        //    else if (branchCode == "KAP")
        //    {
        //        override_specific_approver += " AND userName = 'tina' OR userName = 'elma' "; 
        //    }

        //    managers = "";
        //} 
        //else if(userName == "joana") // general accountant
        //{
        //    override_specific_approver += " AND userName = 'Analyn' ";
        //}
        //else if(userName == "au" || userName == "julie" || userName == "che")
        //{
        //    override_specific_approver += " AND userName = 'RRT1105' ";// ronaldo tabamo
        //}
        //else if (userName == "Cyrine01")
        //{
        //    override_specific_approver += " AND userName = 'Deenboy' ";
        //}
        //else if(position.Contains("audit"))
        //{
        //    override_specific_approver += "AND userName = 'Melody' ";
        //}
        //else if(position.Contains("admin assistant") && branchCode != "MAC") // requested 05-04-2023
        //{
        //    override_specific_approver += "AND userName = 'au' ";
        //}
        //else if (userName == "Jopay19" || userName == "Efrell07") // requested 05-04-2023
        //{
        //    override_specific_approver += "AND userName = 'che' ";
        //}
        //else if(userName == "ghing")
        //{
        //    override_specific_approver += "AND userName = 'tina' ";
        //}

        //if (branchCode == "CAU")
        //{
        //    override_specific_approver += " AND userName = 'Cliff' ";
        //}
        //else if (branchCode == "STB")
        //{
        //    override_specific_approver += " AND userName = 'JMS18' ";
        //}

        //else if (userName == "ART0516")
        //{
        //    // requested by art 7/20/2023
        //    override_specific_approver += " AND userName = 'muc' or userName = 'Deenboy' ";
        //}
        //else if (userName == "Ruby3572")
        //{
        //    // requested  8/23/2023
        //    override_specific_approver += " AND userName = 'Deenboy' ";
        //}



    }
}
