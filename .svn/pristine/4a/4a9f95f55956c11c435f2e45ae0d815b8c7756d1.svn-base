namespace ReqApi.DTO
{
    public class RequestMasterDTO
    {
        public RequestMasterDTO(string requestNo, DateTime requestDate, string requestTypeCode, 
            DateTime? requirementDate, string objective, string createdBy,
            string branchCode, string approver1 = "", string approver2 = "",
            string approver3 = "", string approver4 = "", string approver5 = "",
            string approved1 = "", string approved2 = "", string approved3 = "",
            string approved4 = "", string approved5 = "", DateTime? approvedDate1 = null,
            DateTime? approvedDate2 = null, DateTime? approvedDate3 = null,
            DateTime? approvedDate4 = null, DateTime? approvedDate5 = null, 
            string closed = null, string createdByName = null, 
            string updatedByName = null, 
            string type = null) 
        {
            RequestNo = requestNo;
            RequestDate = requestDate;
            RequestTypeCode = requestTypeCode;
            RequirementDate = requirementDate;
            Objective = objective;
            CreatedBy = createdBy;
            BranchCode = branchCode;
            Approver1 = approver1.Trim(); Approver2 = approver2?.Trim(); Approver3 = approver3?.Trim(); Approver4 = approver4?.Trim(); Approver5 = approver5?.Trim();
            Approved1 = approved1; Approved2 = approved2; Approved3 = approved3; Approved4 = approved4; Approved5 = approved5;
            ApprovedDate1 = approvedDate1; ApprovedDate2 = approvedDate2; ApprovedDate3 = approvedDate3; ApprovedDate4 = approvedDate4; ApprovedDate5 = approvedDate5;
            Closed = closed;
            CreatedByName = createdByName;
            UpdatedByName = updatedByName;
            Type = type;
        }

        public string RequestNo { get; set; }
        public string RequestTypeCode { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public string UpdatedByName { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? RequirementDate { get; set; }
        public string Objective { get; set; } 
        public string BranchCode { get; set; }
        public string Approver1 { get; set; }
        public string Approver2 { get; set; }
        public string Approver3 { get; set; }
        public string Approver4 { get; set; }
        public string Approver5 { get; set; }
        public DateTime? ApprovedDate1 { get; set; }
        public DateTime? ApprovedDate2 { get; set; }
        public DateTime? ApprovedDate3 { get; set; }
        public DateTime? ApprovedDate4 { get; set; }
        public DateTime? ApprovedDate5 { get; set; }
        public string Approved1 { get; set; }
        public string Approved2 { get; set; }
        public string Approved3 { get; set; }
        public string Approved4 { get; set; }
        public string Approved5 { get; set; }
        public string Closed { get; set; }
        public string Type { get; set; }
    }
}
