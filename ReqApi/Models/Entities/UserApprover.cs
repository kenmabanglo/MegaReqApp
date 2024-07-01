﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReqApi.Models.Entities
{
    public partial class UserApprover
    {

        public Guid TranId { get; set; }
        public string UserName { get; set; }

        public string ApproverUserName { get; set; }
        public string BranchCode { get; set; }
        public string PositionName { get; set; }
        public string UserAdd { get; set; }
        public DateTime Created { get; set; }

    }
}
