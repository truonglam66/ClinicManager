//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ClinicManager.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Account
    {
        public int IdUser { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public System.DateTime DateOfBirth { get; set; }
        public bool Gender { get; set; }
        public string IdentityCardNumber { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public Nullable<bool> isActive { get; set; }
        public int Role { get; set; }
    }
}
