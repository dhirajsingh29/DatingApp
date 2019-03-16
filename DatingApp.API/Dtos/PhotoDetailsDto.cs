
namespace DatingApp.API.Dtos
{
    public class PhotoDetailsDto
    {
        public int PhotoId { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public System.DateTime DateAdded { get; set; }
        public bool IsProfilePic { get; set;}
    }
}