using ReqApi.Models.Enums;

namespace ReqApi.DTO
{
    public class ResponseDTO
    {
        public ResponseDTO(ResponseCode responseCode, string responseMessage, object dataSet)
        {
            ResponseCode = responseCode;
            ResponseMessage = responseMessage;
            DataSet = dataSet;
        }

        public ResponseCode ResponseCode { get; set; }
        public string ResponseMessage { get; set; }

        public object DataSet { get; set; }
    }
}
