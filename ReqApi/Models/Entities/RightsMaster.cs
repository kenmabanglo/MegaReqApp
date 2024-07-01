using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace ReqApi.Models.Entities
{

    [Table("rightsMaster")]
    public partial class RightsMaster
    {
        [Key]
        [StringLength(5)]
        public string RightsCode { get; set; }

        [StringLength(50)]
        public string Rightsname { get; set; }

        [StringLength(2)]
        public string Module { get; set; }

        [StringLength(20)]
        public string Type { get; set; }

        [StringLength(5)]
        public string ParentRightsCode { get; set; }

        [StringLength(8)]
        public string UserName { get; set; }

        public DateTime? DateAdd { get; set; }

        [StringLength(3)]
        public string BranchCode { get; set; }
    }
}

