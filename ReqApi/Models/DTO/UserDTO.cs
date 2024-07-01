﻿using ReqApi.Models.Entities;

namespace ReqApi.DTO
{
    public class UserDTO
    {
        public UserDTO(string id, string email, string userName, string firstName, string lastName, DateTime created, string role, string branchCode, int? approver= 0, UserSetting userSettings = null, string positionName = null, object rights = null)
        {
            Id = id;
            Email = email;
            UserName = userName;
            FirstName = firstName;
            LastName = lastName;
            Created = created;
            Role = role;
            BranchCode = branchCode;
            Approver = approver;
            UserSettings = userSettings;
            PositionName = positionName;
            Rights = rights;
        }


        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? Created { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public string PositionName { get; set; }
        public int? Approver { get; set; }

        public UserSetting UserSettings { get; set; }

        public object Rights { get; set; }
    }

    public class UserSelectDTO
    {
        public UserSelectDTO(string userName, string branchCode, string positionName= "", string fullName = null, int active = 0)
        {
            UserName = userName;
            BranchCode = branchCode;
            PositionName = positionName;
            FullName = fullName;
            Active = active;    
        }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string BranchCode { get; set; }

        public string PositionName { get; set; } 
        public int Active { get; set; }
    }

    public class BranchSelectDTO
    {
        public BranchSelectDTO(string divisionCode, string divisionName)
        {
            DivisionCode = divisionCode;
            DivisionName = divisionName;
        }

        public string DivisionCode { get; set; }
        public string DivisionName { get; set; }

    }


}
