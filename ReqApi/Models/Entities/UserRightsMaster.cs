using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace ReqApi.Models.Entities
{

    [Table("userRightsMaster")]
    public partial class UserRightsMaster
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(8)]
        public string UserCode { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(5)]
        public string RightsCode { get; set; }

        [StringLength(8)]
        public string UserAdd { get; set; }

        public DateTime? DateAdd { get; set; }

        [StringLength(3)]
        public string BranchCode { get; set; }
    }
}
