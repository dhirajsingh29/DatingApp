using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class RegisterUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(16, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 16 characters")]
        public string Password { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string Nickname { get; set; }

        [Required]
        public System.DateTime DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }
        public System.DateTime CreateDate { get; set; }
        public System.DateTime LastActive { get; set; }

        public RegisterUserDto()
        {
            CreateDate = System.DateTime.Now;
            LastActive = System.DateTime.Now;
        }
    }
}