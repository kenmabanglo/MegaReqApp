using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    [Keyless]
    public class VwCurrentUserBranchMaster
    {
        public string UserName { get; set; }

        public string BranchCode { get; set; }
        public string DivisionName { get; set; }
        public DateTime? DateAdd { get; set; } 
    }
}
