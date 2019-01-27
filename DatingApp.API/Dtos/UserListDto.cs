using System;

namespace DatingApp.API.Dtos
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get;set; }
        public int Age { get; set; }
        public string Nickname { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastActive { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PicUrl { get; set; }
    }
}