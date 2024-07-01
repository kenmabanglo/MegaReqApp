using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class RequestMaster
    {
        [Key, StringLength(8)]
        [Column(Order = 0)]
        public string RequestNo { get; set; }

        [Key, StringLength(3)]
        [Column(Order = 1)]
        public string RequestTypeCode { get; set; }

        [Key, StringLength(3)]
        [Column(Order = 2)]
        public string BranchCode { get; set; }
        public DateTime RequestDate { get; set; }
        public string SupplierCode { get; set; }
        public string Reference { get; set; }
        public string Objective { get; set; }
        public string Description { get; set; }
        public string Recommendation { get; set; }
        public DateTime? RequirementDate { get; set; }
        public string ReferenceAdb { get; set; }
        //public string ReferenceRfp { get; set; }

        public decimal? EWT { get; set; }
        public string AssignedTo { get; set; }
        public string PayableTo { get; set; }
        public string Rstype { get; set; }

        [StringLength(1)]
        public string IsReferral { get; set; } = "N";
        public string rfpSource { get; set; }

        [StringLength(20)]
        public string Rfatype { get; set; }

        [StringLength(5)]
        public string RequestItemsType { get; set; }
        public string ProcessedByAp { get; set; }
        public string ProcessedByGl { get; set; }
        public string LiquidatedBy { get; set; }

        [Column(TypeName = "numeric")]
        public decimal? Quantity { get; set; }
        public decimal? Cost { get; set; }
        public decimal? ExtendedAmount { get; set; }
        //public decimal? RefundAmount { get; set; }
        public string Approver1 { get; set; }
        public string Approved1 { get; set; } = "N";
        public DateTime? ApprovedDate1 { get; set; }
        public string Approver2 { get; set; }
        public string Approved2 { get; set; } = "N";
        public DateTime? ApprovedDate2 { get; set; }
        public string Approver3 { get; set; }
        public string Approved3 { get; set; } = "N";
        public DateTime? ApprovedDate3 { get; set; }
        public string Approver4 { get; set; }
        public string Approved4 { get; set; } = "N";
        public DateTime? ApprovedDate4 { get; set; }
        public string Approver5 { get; set; }
        public string Approved5 { get; set; } = "N";
        public DateTime? ApprovedDate5 { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
         

        [StringLength(1)]
        public string Closed { get; set; } 

        [NotMapped]
        public string FormattedRequestDate
        {
            get
            {
                return RequestDate.ToString("MM/dd/yyyy");
            }
        }

        [NotMapped]
        public string CreatedByName { get; set; }

        [NotMapped]
        public string UpdatedByName { get; set; }

        [NotMapped]
        public string BranchName { get; set; }
        public virtual List<RequestItem> RequestItems { get; set; }
        public virtual List<RequestFiles> RequestFiles { get; set; }

        [NotMapped]
        public string Supplier { get; set; }

        

    }

}
