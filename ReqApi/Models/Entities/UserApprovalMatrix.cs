using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class UserApprovalMatrix
    {

        [Key, StringLength(50)]
        public string PositionName { get; set; }

        public string PositionRank { get; set; }

        [Key]
        public int Level { get; set; }
         
        public decimal? LimitFrom { get; set; }
         
        public decimal? LimitTo { get; set; }

        [StringLength(1)]
        public string Approver1 { get; set; } = "N";

        [StringLength(1)]
        public string Approver2 { get; set; } = "N";

        public DateTime? CreatedDate { get; set; }

        public string CreatedBy { get; set; }

    }
}
