using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class RequestFiles
    {
        [Key, Required]
        public int Row { get; set; }
         
        [Key, StringLength(8)]
        public string RequestNo { get; set; }

        [Key, StringLength(3)]
        public string RequestTypeCode { get; set; }

        [Key, StringLength(3)]
        public string BranchCode { get; set; }

        public byte[] File { get; set; }
        public string FileName { get; set; }

        public string MimeType { get; set; }
        public long FileSize { get; set; }

    }
}
