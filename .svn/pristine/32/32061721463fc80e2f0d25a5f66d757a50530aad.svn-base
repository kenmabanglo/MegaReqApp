using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class SysTransactionParam
    {
        [Key, StringLength(3), Required]
        [Column(Order = 0)]
        public string RequestTypeCode { get; set; }

        public string RequestTypeName { get; set; }

        [Column(TypeName = "numeric")]
        public decimal LastNo { get; set; }
       
        public string Locked { get; set; }
        
        public string LockedBy { get; set; }

        [Key, StringLength(3), Required]
        [Column(Order = 1)]
        public string BranchCode { get; set; }
    }
}
