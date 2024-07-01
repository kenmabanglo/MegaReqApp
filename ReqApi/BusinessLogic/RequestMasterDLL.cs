using Microsoft.EntityFrameworkCore;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;

namespace ReqApi.DataLogic
{
    public class RequestMasterDLL
    {
        public static string SaveRequest(ReqappDBContext dbContext, RequestMasterBindingModel model)
        {
            string requestNo = String.Empty;

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var header = model.B_RequestMaster;

                    requestNo = SysTransactionParamDLL.GetNextTransactionNo(dbContext, header.RequestTypeCode.Trim(), header.BranchCode.Trim(), header.CreatedBy.Trim().ToLower());
                    header.RequestNo = requestNo;

                    bool hasItems = false;
                    if (header.RequestTypeCode == "RTO" || header.RequestTypeCode == "RFS"
                        || header.RequestTypeCode == "RFA" || header.RequestTypeCode == "RS"
                        || header.RequestTypeCode == "ADB" || header.RequestTypeCode == "RFB"
                        || header.RequestTypeCode == "FL")
                    {
                        hasItems = true;
                    }

                    dbContext.RequestMasters.Add(header);

                    if (hasItems)
                    {
                        foreach (var md_item in model.B_RequestItems)

                        {
                            RequestItem item = new RequestItem();
                            item = md_item;
                            if (md_item != null)
                            {
                                item.RequestNo = requestNo;
                                item.BranchCode = header.BranchCode;
                                item.RequestTypeCode = header.RequestTypeCode;

                                dbContext.RequestItems.Add(item);
                            }
                        }
                    }

                    SysTransactionParamDLL.SetNextTransactionNo(dbContext, header.RequestTypeCode.Trim(), header.BranchCode.Trim(), header.CreatedBy.Trim().ToLower());

                    dbContext.SaveChanges();
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

            return requestNo;
        }

        public static string UpdateRequest(ReqappDBContext dbContext, RequestMaster model, RequestMaster request, RequestItem[] items)
        {
            string requestNo = model.RequestNo;

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    //request = model;
                    //request.ReferenceAdb = model.ReferenceAdb.Trim();
                    //request.Description = model.Description.Trim();
                    //request.PayableTo = model.PayableTo.Trim();
                    //request.Approver1 = model.Approver1.Trim();
                    //request.Approver2 = model.Approver2;
                    //request.Approver3 = model.Approver3;
                    //request.Approver4 = model.Approver4;
                    //request.Approver5 = model.Approver5;
                    //request.ProcessedByAp = model.ProcessedByAp.Trim();
                    //request.LiquidatedBy = model.LiquidatedBy.Trim();
                    //request.UpdatedBy = model.UpdatedBy.Trim();
                    //request.UpdatedDate = model.UpdatedDate;

                    //dbContext.Entry(request).State = EntityState.Modified;

                    // save items

                    // var ritems = dbContext.RequestItems.Where(x => x.RequestNo == model.RequestNo && x.RequestTypeCode == model.RequestTypeCode && x.BranchCode == model.BranchCode).ToList();
                    int ctr = 0;
                    foreach (var md_item in items)

                    {
                        RequestItem item = new RequestItem();
                        item = md_item;
                        if (md_item != null)
                        {
                            item.RequestNo = requestNo;
                            item.BranchCode = model.BranchCode;
                            item.RequestTypeCode = model.RequestTypeCode;
                            item.Quantity = md_item.Quantity;
                            item.Remarks = md_item.Remarks;
                            item.Onhand = md_item.Onhand;

                            dbContext.Entry(item).State = EntityState.Modified;
                        }
                    }

                    //dbContext.Entry(ritems).State = EntityState.Modified;

                    dbContext.SaveChanges();

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

            return requestNo;
        }

        public static int ApproveRequest(ReqappDBContext dbContext, ApproveRequestBindingModel m, RequestMaster request)
        {
            int rows_affected = 0; int result = 0;
            String sql = String.Empty;
            string requestNo = m.RequestNo;
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var date = DateTime.Now;
                    string sqlFormattedDate = date.ToString("yyyy-MM-dd HH:mm:ss.fff");

                    // approve
                    if (request.Approver1 != null && request.Approver1.Trim() == m.Approver1)
                    {
                        request.Approved1 = m.Approved1; request.ApprovedDate1 = date;
                    }
                    else if (request.Approver2 != null && request.Approver2.Trim() == m.Approver2)
                    {
                        request.Approved2 = m.Approved2; request.ApprovedDate2 = date;
                    }
                    else if (request.Approver3 != null && request.Approver3.Trim() == m.Approver3)
                    {
                        request.Approved3 = m.Approved3; request.ApprovedDate3 = date;
                    }
                    else if (request.Approver4 != null && request.Approver4.Trim() == m.Approver4)
                    {
                        request.Approved4 = m.Approved4; request.ApprovedDate4 = date;
                    }
                    else if (request.Approver5 != null && request.Approver5.Trim() == m.Approver5)
                    {
                        request.Approved5 = m.Approved5; request.ApprovedDate5 = date;
                    }
                    // merge recommendation
                    if (request.Recommendation != null || request.Recommendation != "")
                    {
                        m.Recommendation = request.Recommendation + "+CHAR(13)+CHAR(10)+" + m.Recommendation;
                    }
                    request.Recommendation = m.Recommendation;

                    //rows_affected = dbContext.Database.ExecuteSqlRaw(sql);

                    // next approver
                    if (!String.IsNullOrEmpty(m.Approver2)) request.Approver2 = m.Approver2;
                    if (!String.IsNullOrEmpty(m.Approver3)) request.Approver3 = m.Approver3;
                    if (!String.IsNullOrEmpty(m.Approver4)) request.Approver4 = m.Approver4;
                    if (!String.IsNullOrEmpty(m.Approver5)) request.Approver5 = m.Approver5;

                    dbContext.Entry(request).State = EntityState.Modified;
                    dbContext.SaveChanges();
                    result = 1;
                    transaction.Commit();
                    transaction.Dispose();
                }
                catch (Exception ex)
                {
                    result = 0;
                    transaction.Rollback();
                    transaction.Dispose();

                    throw;
                }

            }

            return result;
        }

        public static int ClosedRequest(ReqappDBContext dbContext, ApproveRequestBindingModel m)
        {
            int rows_affected = 0;
            String sql = String.Empty;

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var date = DateTime.Now;
                    string sqlFormattedDate = date.ToString("yyyy-MM-dd HH:mm:ss.fff");

                    sql = sql + String.Format("UPDATE RequestMaster " +
                        "SET " +
                        "Closed = 'Y', UpdatedBy = '{0}', UpdatedDate = '{1}' " +
                        "WHERE RequestNo = '{2}' " +
                        "AND BranchCode = '{3}' AND RequestTypeCode = '{4}'; ",
                        m.UpdatedBy, sqlFormattedDate, m.RequestNo, m.BranchCode, m.RequestTypeCode
                        );

                    rows_affected = dbContext.Database.ExecuteSqlRaw(sql);


                    dbContext.SaveChanges();
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

            return rows_affected;
        }

        public static object GetRequestsForApprovalByApprover(ReqappDBContext dBContext, string user, int pageIndex, int pageSize, string search)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                var response = new Dictionary<string, object>();

                try
                {
                    string sql = String.Format("SELECT * FROM RequestMaster " +
                       "WHERE " +
                       "(" +
                       "(Approver1 = '{0}' AND Approved1 IS NULL) OR" +
                       "(Approver2 = '{0}' AND Approved2 IS NULL) OR " +
                       "(Approver3 = '{0}' AND Approved3 IS NULL) OR " +
                       "(Approver4 = '{0}' AND Approved4 IS NULL) OR " +
                       "(Approver5 = '{0}' AND Approved5 IS NULL)" +
                       ") ",
                       user);

                    if (search != null && search != "")
                    {
                        sql = sql + String.Format("AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%')", search);
                    }

                    sql = sql + String.Format(" ORDER BY RequestDate DESC");

                    var raw_data = dBContext.RequestMasters
                        .FromSqlRaw(sql)
                        .AsNoTracking()
                        .ToList();

                    var requests = raw_data
                     .Select(x => new {
                         x.RequestNo,
                         x.RequestDate,
                         RequestTypeCode= x.RequestTypeCode.Trim(),
                         RequirementDate = x.RequirementDate.HasValue? Convert.ToDateTime(x.RequirementDate).AddDays(1) : (DateTime?)null,
                         //x.RequirementDate,
                         x.Objective,
                         x.CreatedBy,
                         x.BranchCode,
                         x.Approver1,
                         x.Approver2,
                         x.Approver3,
                         x.Approver4,
                         x.Approver5,
                         x.Approved1,
                         x.Approved2,
                         x.Approved3,
                         x.Approved4,
                         x.Approved5,
                         x.ApprovedDate1,
                         x.ApprovedDate2,
                         x.ApprovedDate3,
                         x.ApprovedDate4,
                         x.ApprovedDate5,
                         x.Closed,
                         x.IsReferral,//RFP
                         x.ExtendedAmount,//RFP
                         EstimatedAmount = dBContext.RequestItems
                            .Where(i => i.BranchCode == x.BranchCode && i.RequestTypeCode == x.RequestTypeCode && i.RequestNo == x.RequestNo).Select(w=>w.TotalPrice).Sum(), //ADB
                         CreatedByName = UserMasterDLL.GetName(dBContext, x.CreatedBy),
                         UpdatedByName = UserMasterDLL.GetName(dBContext, x.UpdatedBy)
                     }).ToList();

                    var page = new PaginatedResponse<object>(requests, pageIndex, pageSize);

                    var totalCount = raw_data.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    response["page"] = page;
                    response["totalPages"] = totalPages;

                }
                catch (Exception ex)
                {

                    transaction.Rollback();

                    throw;
                }

                return response;
            }
        }

        public static object GetRequestHistory(ReqappDBContext dBContext, string type, string user, int pageIndex, int pageSize, string search, string requestTypeCode, string closed)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                var response = new Dictionary<string, object>();
                string sql = String.Empty;
                try
                {
                    if (type == "Approver" && closed == null)
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE ((Approver1 = '{0}' AND Approved1 IS NOT NULL) OR " +
                        "(Approver2 = '{0}' AND Approved2 IS NOT NULL) OR " +
                        "(Approver3 = '{0}' AND Approved3 IS NOT NULL) OR " +
                        "(Approver4 = '{0}' AND Approved4 IS NOT NULL) OR " +
                        "(Approver5 = '{0}' AND Approved5 IS NOT NULL)) AND " +
                        "Closed IS NULL ",
                        user);

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }

                    }
                    else if (type == "Approver" && closed == "Y")
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE ((Approver1 = '{0}') OR " +
                        "(Approver2 = '{0}') OR " +
                        "(Approver3 = '{0}') OR " +
                        "(Approver4 = '{0}') OR " +
                        "(Approver5 = '{0}')) AND " +
                        "Closed = 'Y' ", user);

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }
                    }
                    else if (type == "Requestor")
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                            "WHERE CreatedBy = '{0}' AND " +
                            "Approver1 IS NOT NULL ",
                        user);
                    }

                    if (requestTypeCode != "")
                    {
                        sql = sql + String.Format(" AND RequestTypeCode = '" + requestTypeCode + "' ");
                    }

                    sql = sql + String.Format(" ORDER BY RequestDate DESC");

                    var raw_data = dBContext.RequestMasters
                        .FromSqlRaw(sql)
                        .ToList();

                    var requests = raw_data
                     .Select(x => new RequestMasterDTO(
                         x.RequestNo,
                         x.RequestDate,
                         x.RequestTypeCode.Trim(),
                         x.RequirementDate,
                         x.Objective,
                         x.CreatedBy,
                         x.BranchCode,
                         x.Approver1,
                         x.Approver2,
                         x.Approver3,
                         x.Approver4,
                         x.Approver5,
                         x.Approved1,
                         x.Approved2,
                         x.Approved3,
                         x.Approved4,
                         x.Approved5,
                         x.ApprovedDate1,
                         x.ApprovedDate2,
                         x.ApprovedDate3,
                         x.ApprovedDate4,
                         x.ApprovedDate5,
                         x.Closed,
                         x.CreatedByName = UserMasterDLL.GetName(dBContext, x.CreatedBy),
                         x.UpdatedByName = UserMasterDLL.GetName(dBContext, x.UpdatedBy)
                     )).ToList();

                    var page = new PaginatedResponse<RequestMasterDTO>(requests, pageIndex, pageSize);

                    var totalCount = requests.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    response["page"] = page;
                    response["totalPages"] = totalPages;

                }
                catch (Exception ex)
                {

                    transaction.Rollback();

                    throw;
                }

                return response;
            }
        }


        public static object GetApprovalHistory(ReqappDBContext dBContext, string type, string user, int pageIndex, int pageSize, string search, string requestTypeCode, string closed, string status)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                var response = new Dictionary<string, object>();
                string sql = String.Empty;
                var st = status == "approved" ? "Y" : "N";
                try
                {
                    if (type == "Approver")// && closed == null
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE ((Approver1 = '{0}' AND Approved1 = '{1}') OR " +
                        "(Approver2 = '{0}' AND Approved2 = '{1}') OR " +
                        "(Approver3 = '{0}' AND Approved3 = '{1}') OR " +
                        "(Approver4 = '{0}' AND Approved4 = '{1}') OR " +
                        "(Approver5 = '{0}' AND Approved5 = '{1}')) "
                        ,
                        user,st);
                        //"Closed IS NULL "

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }

                    }
                    //else if (type == "Approver" && closed == "Y")
                    //{
                    //    sql = String.Format("SELECT * FROM RequestMaster " +
                    //    "WHERE ((Approver1 = '{0}') OR " +
                    //    "(Approver2 = '{0}') OR " +
                    //    "(Approver3 = '{0}') OR " +
                    //    "(Approver4 = '{0}') OR " +
                    //    "(Approver5 = '{0}')) AND " +
                    //    "Closed = 'Y' ", user);

                    //    // no search for requestor
                    //    if (search != "")
                    //    {
                    //        sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                    //    }
                    //}
                    else if (type == "Requestor")
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                            "WHERE CreatedBy = '{0}' AND " +
                            "Approver1 IS NOT NULL ",
                        user);
                    }

                    if (requestTypeCode != "")
                    {
                        sql = sql + String.Format(" AND RequestTypeCode = '" + requestTypeCode + "' ");
                    }

                    if (type == "Requestor")
                    {
                        sql = sql + String.Format(" ORDER BY RequestDate DESC");
                    }
                    else
                    {
                        sql = sql + String.Format(" ORDER BY (" +
                                       "CASE WHEN Approved5 = 'Y' THEN ApprovedDate5 " +
                                       "WHEN Approved4 = 'Y' THEN ApprovedDate4 " +
                                       "WHEN Approved3 = 'Y' THEN ApprovedDate3 " +
                                       "WHEN Approved2 = 'Y' THEN ApprovedDate2 " +
                                       "WHEN Approved1 = 'Y' THEN ApprovedDate1 " +
                                       "END) DESC");

                    }


                    var raw_data = dBContext.RequestMasters
                        .FromSqlRaw(sql)
                        .ToList();

                    var requests = raw_data
                     .Select(x => new RequestMasterDTO(
                         x.RequestNo,
                         x.RequestDate,
                         x.RequestTypeCode.Trim(),
                         x.RequirementDate,
                         x.Objective,
                         x.CreatedBy,
                         x.BranchCode,
                         x.Approver1,
                         x.Approver2,
                         x.Approver3,
                         x.Approver4,
                         x.Approver5,
                         x.Approved1,
                         x.Approved2,
                         x.Approved3,
                         x.Approved4,
                         x.Approved5,
                         x.ApprovedDate1,
                         x.ApprovedDate2,
                         x.ApprovedDate3,
                         x.ApprovedDate4,
                         x.ApprovedDate5,
                         x.Closed,
                         x.CreatedByName = UserMasterDLL.GetName(dBContext, x.CreatedBy),
                         x.UpdatedByName = UserMasterDLL.GetName(dBContext, x.UpdatedBy)
                     )).ToList();

                    var page = new PaginatedResponse<RequestMasterDTO>(requests, pageIndex, pageSize);

                    var totalCount = requests.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    response["page"] = page;
                    response["totalPages"] = totalPages;

                }
                catch (Exception ex)
                {

                    transaction.Rollback();

                    throw;
                }

                return response;
            }
        }

        public static object ViewApprovedList(ReqappDBContext dBContext, string type, string user, int pageIndex, int pageSize, string search, string requestTypeCode, string closed, string branchCode)
        {
       
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                var response = new Dictionary<string, object>();
                string sql = String.Empty;
                string branchNot = String.Empty;

                try
                {

                    if (branchCode == null && user == "joana")
                    {
                        branchCode = "ILA','VAL','CAU','CPN";
                    }

                    string branch = branchCode != null ? " AND branchCode IN('" + branchCode + "') " : "";

                    //if (branchCode == null && user == "Deferred")
                    //{
                    //    branchNot = " AND branchCode NOT IN('ILA','VAL','CAU','CPN') ";
                    //}

                    if (type == "Viewer" && closed == null)
                    {
                        
                        sql = String.Format("SELECT * FROM RequestMaster " +
                            "WHERE RequestTypeCode IN('{0}') AND Closed IS NULL AND " +
                            "(" +
                            "(CASE WHEN Approver1 IS NOT NULL AND Approved1 = 'Y' THEN 1 WHEN Approver1 IS NULL OR Approver1 = '' THEN 1 ELSE 0 END) = 1 " +
                            "AND " +
                            "(CASE WHEN Approver2 IS NOT NULL AND Approved2 = 'Y' THEN 1 WHEN Approver2 IS NULL OR Approver2 = '' THEN 1 ELSE 0 END) = 1 " +
                            "AND " +
                            "(CASE WHEN Approver3 IS NOT NULL AND Approved3 = 'Y' THEN 1 WHEN Approver3 IS NULL OR Approver3 = '' THEN 1 ELSE 0 END) = 1 " +
                            "AND " +
                            "(CASE WHEN Approver4 IS NOT NULL AND Approved4 = 'Y' THEN 1 WHEN Approver4 IS NULL OR Approver4 = '' THEN 1 ELSE 0 END) = 1 " +
                            "AND " +
                            "(CASE WHEN Approver5 IS NOT NULL AND Approved5 = 'Y' THEN 1 WHEN Approver5 IS NULL OR Approver5 = '' THEN 1 ELSE 0 END) = 1 " +
                            ") {1} {2}", requestTypeCode, branch, branchNot);

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }

                        // Filter Referral & Petty
                        if (requestTypeCode.Contains("RFP"))
                        {
                            if (user == "Deferred")
                            {
                                sql += " AND isReferral = 'Y'";
                            }
                            else if (user == "Rose")
                            {
                                sql += " AND isReferral IN ('Y','N') ";// 02/12/2024
                            }
                            else if (user == "PAULAL")
                            {
                                sql += " AND rfpSource = 'PETTY'";
                            }
                            else if (user == "admin")
                            {
                                sql += "";
                            }
                            else
                            {
                                sql += " AND isReferral = 'N'";// 02/12/2024
                            }
                        } 

                    }
                    else if (type == "Viewer" && closed == "Y")
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE " +
                        "Closed = 'Y'  AND RequestTypeCode IN ('{0}') {1}", requestTypeCode, branch);

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }
                         
                    }

                   

                    
                    sql = sql + String.Format(" ORDER BY ("+
                                        "CASE WHEN Approved5 = 'Y' THEN ApprovedDate5 " +
                                        "WHEN Approved4 = 'Y' THEN ApprovedDate4 " +
                                        "WHEN Approved3 = 'Y' THEN ApprovedDate3 " +
                                        "WHEN Approved2 = 'Y' THEN ApprovedDate2 " +
                                        "WHEN Approved1 = 'Y' THEN ApprovedDate1 " +
                                        "END) DESC");

                    var raw_data = dBContext.RequestMasters
                        .FromSqlRaw(sql)
                        .ToList();

                    var requests = raw_data
                      .Select(x => new
                      {
                          x.RequestNo,
                          x.RequestDate,
                          RequestTypeCode = x.RequestTypeCode.Trim(),
                          x.RequirementDate,
                          x.Objective,
                          x.CreatedBy,
                          x.BranchCode,
                          x.Approver1,
                          x.Approver2,
                          x.Approver3,
                          x.Approver4,
                          x.Approver5,
                          x.Approved1,
                          x.Approved2,
                          x.Approved3,
                          x.Approved4,
                          x.Approved5,
                          x.ApprovedDate1,
                          x.ApprovedDate2,
                          x.ApprovedDate3,
                          x.ApprovedDate4,
                          x.ApprovedDate5,
                          x.Closed,
                          CreatedByName = UserMasterDLL.GetName(dBContext, x.CreatedBy),
                          UpdatedByName = UserMasterDLL.GetName(dBContext, x.UpdatedBy),
                          Type = x.RequestTypeCode == "RTO" ? x.RequestItemsType : (x.RequestTypeCode == "RFP"? (x.rfpSource == "PETTY"? "PETTY" : x.IsReferral) : "")
                      }).ToList();

                    var page = new PaginatedResponse<object>(requests, pageIndex, pageSize);

                    var totalCount = requests.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    response["page"] = page;
                    response["totalPages"] = totalPages;

                }
                catch (Exception ex)
                {

                    transaction.Rollback();

                    throw;
                }

                return response;
            }
        }


        public static object ViewADBDMApprovedList(ReqappDBContext dBContext, string type, string user, int pageIndex, int pageSize, string search, string requestTypeCode, string closed)
        {
            // to do check user if dawn ganern
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                var response = new Dictionary<string, object>();
                string sql = String.Empty;
                string auc = "aileen";
                try
                {
                    if (type == "Viewer" && closed == null)
                    {

                        sql = String.Format("SELECT * FROM RequestMaster " +
                            "WHERE RequestTypeCode IN('{0}') AND Closed IS NULL AND " +
                            "(" +
                            "(CASE WHEN Approver1 = '{1}' AND Approved1 IS NULL THEN 1 ELSE 0 END) = 1 " +
                            "OR " +
                            "(CASE WHEN Approver2 = '{1}' AND Approved2 IS NULL THEN 1 ELSE 0 END) = 1 " +
                            "OR " +
                            "(CASE WHEN Approver3 = '{1}' AND Approved3 IS NULL THEN 1 ELSE 0 END) = 1 " +
                            "OR " +
                            "(CASE WHEN Approver4 = '{1}' AND Approved4 IS NULL THEN 1 ELSE 0 END) = 1 " +
                            "OR " +
                            "(CASE WHEN Approver5 = '{1}' AND Approved5 IS NULL THEN 1 ELSE 0 END) = 1 " +
                            ")", requestTypeCode, auc);

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }

                    }
                    else if (type == "Viewer" && closed == "Y")
                    {
                        sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE " +
                        "Closed = 'Y'  AND RequestTypeCode IN ('{0}') ", requestTypeCode
                        );

                        // no search for requestor
                        if (search != "")
                        {
                            sql = sql + String.Format(" AND (requestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%' OR requestTypeCode LIKE '%{0}%') ", search);
                        }
                    }

                    sql = sql + String.Format(" ORDER BY (" +
                                        "CASE WHEN Approved5 = 'Y' THEN ApprovedDate5 " +
                                        "WHEN Approved4 = 'Y' THEN ApprovedDate4 " +
                                        "WHEN Approved3 = 'Y' THEN ApprovedDate3 " +
                                        "WHEN Approved2 = 'Y' THEN ApprovedDate2 " +
                                        "WHEN Approved1 = 'Y' THEN ApprovedDate1 " +
                                        "END) DESC");

                    var raw_data = dBContext.RequestMasters
                        .FromSqlRaw(sql)
                        .ToList();

                    var requests = raw_data
                      .Select(x => new RequestMasterDTO(
                          x.RequestNo,
                          x.RequestDate,
                          x.RequestTypeCode.Trim(),
                          x.RequirementDate,
                          x.Objective,
                          x.CreatedBy,
                          x.BranchCode,
                          x.Approver1,
                          x.Approver2,
                          x.Approver3,
                          x.Approver4,
                          x.Approver5,
                          x.Approved1,
                          x.Approved2,
                          x.Approved3,
                          x.Approved4,
                          x.Approved5,
                          x.ApprovedDate1,
                          x.ApprovedDate2,
                          x.ApprovedDate3,
                          x.ApprovedDate4,
                          x.ApprovedDate5,
                          x.Closed,
                          x.CreatedByName = UserMasterDLL.GetName(dBContext, x.CreatedBy),
                          x.UpdatedByName = UserMasterDLL.GetName(dBContext, x.UpdatedBy)
                      )).ToList();

                    var page = new PaginatedResponse<RequestMasterDTO>(requests, pageIndex, pageSize);

                    var totalCount = requests.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    response["page"] = page;
                    response["totalPages"] = totalPages;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }

                return response;
            }
        }


        public static int CountRequestsForApprovalByApprover(ReqappDBContext dBContext, string user)
        {
            
                int total = 0;
             
                    string sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE " +
                        "(Approver1 = '{0}' AND Approved1 IS NULL) OR" +
                        "(" +
                        "((Approver2 = '{0}' AND Approved2 IS NULL) OR " +
                        "(Approver3 = '{0}' AND Approved3 IS NULL) OR " +
                        "(Approver4 = '{0}' AND Approved4 IS NULL) OR " +
                        "(Approver5 = '{0}' AND Approved5 IS NULL)) AND " +
                        "Approved1 = 'Y') ",
                        user);

                    total = dBContext.RequestMasters
                        .FromSqlRaw(sql).Count();

             
                return total;
        }

        public static int CountHistoryApprovedRequestsByApprover(ReqappDBContext dBContext, string user)
        {
            
                int total = 0;
              
                    string sql = String.Format("SELECT * FROM RequestMaster " +
                        "WHERE (Approver1 = '{0}' AND Approved1 IS NOT NULL) OR " +
                        "(Approver2 = '{0}' AND Approved2 IS NOT NULL) OR " +
                        "(Approver3 = '{0}' AND Approved3 IS NOT NULL) OR " +
                        "(Approver4 = '{0}' AND Approved4 IS NOT NULL) OR " +
                        "(Approver5 = '{0}' AND Approved5 IS NOT NULL) ",
                        user);

                    total = dBContext.RequestMasters
                        .FromSqlRaw(sql).Count();


             
                return total; 
        }

        public static object GetRequestDetails(ReqappDBContext dBContext, string requestNo, string branchCode, string requestTypeCode)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {
                var new_data = new object();
                var data = new List<RequestMaster>();
                try
                {
                    data = dBContext.RequestMasters
                        .Where(x => x.RequestNo == requestNo && x.BranchCode == branchCode && x.RequestTypeCode == requestTypeCode)
                        .AsNoTracking()
                        .ToList();
                    if (data != null)
                    {
                        data[0].CreatedByName = UserMasterDLL.GetName(dBContext, data[0].CreatedBy);
                        data[0].UpdatedByName = UserMasterDLL.GetName(dBContext, data[0].UpdatedBy);
                        data[0].BranchName = DivisionMasterDLL.BranchName(dBContext, data[0].BranchCode);

                        if (data[0].RequirementDate != null)
                            data[0].RequirementDate = Convert.ToDateTime((data[0].RequirementDate)).AddDays(1);

                        var ritems = dBContext.RequestItems.Where(w => w.RequestNo == requestNo && w.RequestTypeCode == requestTypeCode && w.BranchCode == branchCode).ToList();
                        new_data = data.Select(requestHdr => new
                        {
                            requestHdr,
                            approvers = new
                            {
                                name1 = UserMasterDLL.GetName(dBContext, requestHdr.Approver1),
                                name2 = UserMasterDLL.GetName(dBContext, requestHdr.Approver2),
                                name3 = UserMasterDLL.GetName(dBContext, requestHdr.Approver3),
                                name4 = UserMasterDLL.GetName(dBContext, requestHdr.Approver4),
                                name5 = UserMasterDLL.GetName(dBContext, requestHdr.Approver5)
                            },
                            requestItems = ritems,
                            totalAmount = ritems.Select(i => i.TotalPrice).Sum(),
                            supplier = SupplierMasterDLL.SupplierName(dBContext, requestHdr.SupplierCode)
                        }).AsEnumerable().ToList()[0];
                    } 
                }
                 //totalAmount = dBContext.RequestItems.Where(i => i.RequestNo == requestHdr.RequestNo && i.BranchCode == requestHdr.BranchCode && i.RequestTypeCode == requestHdr.RequestTypeCode)
                 //           .Select(i => i.TotalPrice).Sum(),
                catch (Exception)
                {

                    transaction.Rollback();
                    throw;
                }
                return new_data;

            }
        }

        public static object GetRequestFiles(ReqappDBContext dBContext, string requestNo, string branchCode, string requestTypeCode)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {

                var data = new object();
                try
                {
                    var result = dBContext.RequestFiles
                        .Where(x => x.RequestNo == requestNo && x.BranchCode == branchCode && x.RequestTypeCode == requestTypeCode)
                        .AsNoTracking()
                        .ToList<RequestFiles>();

                    data = result.Select(x => new
                    {
                        x.Row,
                        x.RequestNo,
                        x.RequestTypeCode,
                        x.BranchCode
                        ,
                        x.FileName,
                        x.MimeType,
                        x.FileSize
                    });
                }
                catch (Exception)
                {

                    transaction.Rollback();

                    throw;
                }

                return data;
            }
        }

        public static RequestFiles GetFile(ReqappDBContext dBContext, string requestNo, string branchCode, string requestTypeCode, int row)
        {
            using (var transaction = dBContext.Database.BeginTransaction())
            {

                var data = new RequestFiles();
                try
                {
                    data = dBContext.RequestFiles
                        .Where(x => x.RequestNo == requestNo && x.BranchCode == branchCode && x.RequestTypeCode == requestTypeCode && x.Row == row)
                        .AsNoTracking()
                        .SingleOrDefault();
                }
                catch (Exception)
                {

                    transaction.Rollback();

                    throw;
                }

                return data;
            }
        }
         
        public static object ADBNo(ReqappDBContext dbContext, int pageIndex, int pageSize, string branchCode = "", string search = "")
        {
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT * FROM RequestMaster WHERE RequestTypeCode = 'ADB' AND branchCode = '{0}' AND " +
                        "(" +
                        "(CASE WHEN Approver1 IS NOT NULL AND Approved1 = 'Y' THEN 1 WHEN Approver1 IS NULL OR Approver1 = ''  THEN 1 ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver2 IS NOT NULL AND Approved2 = 'Y' THEN 1 WHEN Approver2 IS NULL OR Approver2 = ''  THEN 1 ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver3 IS NOT NULL AND Approved3 = 'Y' THEN 1 WHEN Approver3 IS NULL OR Approver3 = ''  THEN 1 ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver4 IS NOT NULL AND Approved4 = 'Y' THEN 1 WHEN Approver4 IS NULL OR Approver4 = ''  THEN 1  ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver5 IS NOT NULL AND Approved5 = 'Y' THEN 1 WHEN Approver5 IS NULL OR Approver5 = ''  THEN 1  ELSE 0 END) = 1 " +
                        ")", branchCode);
                    if (sql != null)
                    {
                        sql = sql + String.Format(" AND ( RequestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%') ", search);
                    }
                    var data = dbContext.RequestMasters
                       .FromSqlRaw(sql) 
                       .OrderByDescending(c => c.RequestNo)
                       .ToList();

                    var raw_data = data.Select(x => new {
                        x.RequestNo,
                        x.BranchCode,
                        x.RequestTypeCode,
                        CreatedByName = UserMasterDLL.GetName(dbContext, x.CreatedBy),
                        x.FormattedRequestDate,
                        x.Objective,
                        TotalAmount = dbContext.RequestItems.Where(i => i.RequestNo == x.RequestNo && i.BranchCode == x.BranchCode && i.RequestTypeCode == x.RequestTypeCode)
                        .Select(i => i.TotalPrice).Sum()
                    }).ToList();

                    var page = new PaginatedResponse<object>(raw_data, pageIndex, pageSize);

                    var totalCount = raw_data.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    var response = new
                    {
                        Page = page,
                        TotalPages = totalPages
                    };

                    return response;

                }
                catch (Exception)
                {

                    throw;
                }

            }


        }

        public static object RFPNo(ReqappDBContext dbContext, int pageIndex, int pageSize, string branchCode = "", string search = "")
        {
            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    string sql = String.Format("SELECT * FROM RequestMaster WHERE RequestTypeCode = 'RFP' AND branchCode = '{0}' AND " +
                        "(" +
                        "(CASE WHEN Approver1 IS NOT NULL AND Approved1 = 'Y' THEN 1 WHEN Approver1 IS NULL OR Approver1 = ''  THEN 1 ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver2 IS NOT NULL AND Approved2 = 'Y' THEN 1 WHEN Approver2 IS NULL OR Approver2 = ''  THEN 1 ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver3 IS NOT NULL AND Approved3 = 'Y' THEN 1 WHEN Approver3 IS NULL OR Approver3 = ''  THEN 1 ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver4 IS NOT NULL AND Approved4 = 'Y' THEN 1 WHEN Approver4 IS NULL OR Approver4 = ''  THEN 1  ELSE 0 END) = 1 " +
                        "AND " +
                        "(CASE WHEN Approver5 IS NOT NULL AND Approved5 = 'Y' THEN 1 WHEN Approver5 IS NULL OR Approver5 = ''  THEN 1  ELSE 0 END) = 1 " +
                        ")", branchCode);
                    if (sql != null)
                    {
                        sql = sql + String.Format(" AND ( RequestNo LIKE '%{0}%' OR createdBy LIKE '%{0}%' OR objective LIKE '%{0}%') ", search);
                    }
                    var data = dbContext.RequestMasters
                       .FromSqlRaw(sql)
                       .OrderByDescending(c => c.RequestNo)
                       .ToList();

                    var raw_data = data.Select(x => new {
                        x.RequestNo,
                        x.BranchCode,
                        x.RequestTypeCode,
                        CreatedByName = UserMasterDLL.GetName(dbContext, x.CreatedBy),
                        x.FormattedRequestDate,
                        x.Objective,
                        x.ExtendedAmount
                        //TotalAmount = dbContext.RequestItems.Where(i => i.RequestNo == x.RequestNo && i.BranchCode == x.BranchCode && i.RequestTypeCode == x.RequestTypeCode)
                        //.Select(i => i.TotalPrice).Sum()
                    }).ToList();

                    var page = new PaginatedResponse<object>(raw_data, pageIndex, pageSize);

                    var totalCount = raw_data.Count();
                    var totalPages = Math.Ceiling((double)totalCount / pageSize);

                    var response = new
                    {
                        Page = page,
                        TotalPages = totalPages
                    };

                    return response;

                }
                catch (Exception)
                {

                    throw;
                }

            }


        }

        public static List<VwSerialNoMaster> VerifySerialNoAvailability(ReqappDBContext dbContext, string itemCode, string serialNo)
        { 

            string sql = string.Format("Select * from vw_serialNoMaster where itemCode = '{0}' and serialNo = '{1}' ORDER BY dateAdd DESC", itemCode, serialNo);
            var sno = dbContext.VwSerialNoMasters.FromSqlRaw(sql).ToList<VwSerialNoMaster>();

            return sno;

        }

    }
}