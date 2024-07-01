using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class UserBranchMaster
    {
        [Key, StringLength(20)]
        public string UserName { get; set; } 

        [Required, StringLength(3)]
        public string BranchCode { get; set; }

        public DateTime? DateAdd { get; set; }
         
    }
}
