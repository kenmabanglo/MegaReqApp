using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    [Table("SerialNoMaster")]
    public class SerialNoMaster
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(8)]
        public string ItemCode { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(8)]
        public string RequestNo { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(3)]
        public string RequestTypeCode { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(3)]
        public string BranchCode { get; set; }

        [StringLength(50)]
        public string SerialNo { get; set; }

        public DateTime DateAdd { get; set; }


    }
}
