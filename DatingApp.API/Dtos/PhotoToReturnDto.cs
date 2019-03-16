namespace DatingApp.API.Dtos
{
    public class PhotoToReturnDto
    {
        public int PhotoId { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public System.DateTime DateAdded { get; set; }
        public bool IsProfilePic { get; set;}
        public string PublicId { get; set; }
    }
}