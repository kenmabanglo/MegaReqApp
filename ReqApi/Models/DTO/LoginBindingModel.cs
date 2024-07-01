using System.ComponentModel.DataAnnotations;

namespace ReqApi.DTO
{

    public class LoginBindingModel
    {


        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
