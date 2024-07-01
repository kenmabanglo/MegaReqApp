using System;
using System.Collections.Generic;

namespace ReqApi.Models.Entities
{
    public partial class VwSerialNoMaster
    {
        public string ItemCode { get; set; } = null!;
        public string locationCode { get; set; }
        public string serialNo { get; set; }
        public string serialNoStatusCode { get; set; }
        public string supplierCode { get; set; }
        public DateTime? dateAdd { get; set; }
    }
}
