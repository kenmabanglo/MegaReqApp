using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class UserSetting
    {
        [Key, StringLength(20)]
        public string UserName { get; set; }

        [Required, StringLength(100)]
        public string FullName { get; set; }

        [Required]
        public string UserType { get; set; }

        [Required]
        public string PositionName { get; set; }

        public string PositionRank { get; set; }

        [Required]
        public string BranchCode { get; set; }

        [NotMapped]
        public string BranchName { get; set; }

        [StringLength(1)]
        public string StoreBased { get; set; } = "Y";

        public byte[] Image { get; set; }
        public string ImagePath { get; set; }

        public string MimeType { get; set; }

        public int Active { get; set; } = 0;
        public string DigitalSignature { get; set; }

        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }

        //public virtual List<UserBranchMaster> DM_Branches { get; set; }

        //[NotMapped]
        public virtual List<UserBranchMaster> UserBranches { get; set; }

    }
}
