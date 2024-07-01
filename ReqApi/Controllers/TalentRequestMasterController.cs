using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReqApi.DataLogic;
using ReqApi.DTO;
using ReqApi.Models.Context;
using ReqApi.Models.Entities;
using ReqApi.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace ReqApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class TalentRequestMaster : ControllerBase
    {
        private readonly ReqappDBContext dbContext;

        public TalentRequestMaster(ReqappDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("GetReason")]
        public async Task<object> GetReason()
        {
            try
            {

                var list = TalentRequestMasterDLL.RequestReasonMasterList(dbContext);

                return await Task.FromResult(list);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet("EmpStatus")]
        public async Task<object> EmpStatus()
        {
            try
            {

                var list = TalentRequestMasterDLL.EmpStatusMasterList(dbContext);

                return await Task.FromResult(list);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }
        

        [HttpGet("Allowances")]
        public async Task<object> Allowances()
        {
            try
            {

                var list = TalentRequestMasterDLL.AllowancesMasterList(dbContext);

                return await Task.FromResult(list);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }

        

        [HttpGet("Benefits")]
        public async Task<object> Benefits()
        {
            try
            {

                var list = TalentRequestMasterDLL.BenefitsPackageMasterList(dbContext);

                return await Task.FromResult(list);

            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseDTO(ResponseCode.Error, ex.Message, null));
            }
        }
    }

}
