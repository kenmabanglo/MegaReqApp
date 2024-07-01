using ReqApi.Models.Entities;

namespace ReqApi.DTO
{
    public class RequestMasterBindingModel
    { 
        public RequestMaster B_RequestMaster { get; set; }
        public RequestItem[] B_RequestItems { get; set; }

    }
}
