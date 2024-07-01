using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class RequestItem
    {
        [Key, Required]
        public int Row { get; set; }
         
        [Key, StringLength(8)]
        public string RequestNo { get; set; }

        [Key, StringLength(3)]
        public string RequestTypeCode { get; set; }

        [Key, StringLength(3)]
        public string BranchCode { get; set; }

        [StringLength(8)]
        public string ItemCode { get; set; }
        public string SupplierCode { get; set; }
       
        public string SupplierName { get; set; }

        [Column(TypeName = "numeric")]
        public decimal? Quantity { get; set; }
        public decimal? Cost { get; set; }
        public decimal? Price { get; set; }
        public decimal? Onhand { get; set; }
        public decimal? TotalCost { get; set; }
        public decimal? TotalPrice { get; set; }

        public string Remarks { get; set; }
        public string Description { get; set; }

        [StringLength(1000)]
        public string SerialNo { get; set; }

        [StringLength(500)]
        public string Status { get; set; }

        [StringLength(5)]
        public string LocationCode { get; set; }

    }
}
