using System;
using System.Collections.Generic;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class UserDetailsDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get;set; }
        public int Age { get; set; }
        public string Nickname { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PicUrl { get; set; }
        
        // we are returning PhotoDetailsDto and not Photo here, inorder to avoid password details
        // being sent and returned via API 
        public ICollection<PhotoDetailsDto> Photos { get; set; }
    }
}