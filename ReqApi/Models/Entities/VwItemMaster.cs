using System;
using System.Collections.Generic;

namespace ReqApi.Models.Entities
{
    public partial class VwItemMaster
    {
        public string ItemCode { get; set; } = null!;
        public string ItemName { get; set; } = null!;
        public string ItemStatus { get; set; } = null!;
        public decimal Price { get; set; }
        public string Serialized { get; set; }
        public string BrandCode { get; set; }
    }
}
