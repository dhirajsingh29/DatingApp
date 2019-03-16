
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{
    public class PhotoCreationDto
    {
        public string Url { get; set; }        
        public IFormFile File { get; set; } // this is the file (photo) that we will be uploading
        public string Description { get; set; }
        public System.DateTime DateAdded { get; set; }
        public string PublicId { get; set; }

        public PhotoCreationDto()
        {
            DateAdded = System.DateTime.Now;
        }
    }
}