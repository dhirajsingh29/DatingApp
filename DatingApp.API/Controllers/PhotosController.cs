using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.DataAccessLayer.Dating;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinaryConfigurations> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repository, IMapper mapper,
            IOptions<CloudinaryConfigurations> cloudinaryConfig)
        {
            this._mapper = mapper;
            this._repository = repository;
            this._cloudinaryConfig = cloudinaryConfig;

            Account account = new Account
            (
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromDb = await _repository.GetPhoto(id);

            var photo = _mapper.Map<PhotoToReturnDto>(photoFromDb);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhoto(int userId, [FromForm]PhotoCreationDto photoCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userId);

            var file = photoCreationDto.File;
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var imageUploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(imageUploadParams);
                }
            }

            photoCreationDto.Url = uploadResult.Uri.ToString();
            photoCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoCreationDto);

            if (!user.Photos.Any(x => x.IsProfilePic))
            {
                photo.IsProfilePic = true;
            }

            user.Photos.Add(photo);

            if (await _repository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoToReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.PhotoId }, photoToReturn);
            }

            return BadRequest("Photo upload resulted in an error");
        }

        [HttpPost("{id}/setProfilePic")]
        public async Task<IActionResult> SetProfilePic(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userId);

            if (!user.Photos.Any(x => x.PhotoId == id))
                return Unauthorized();

            var photo = await _repository.GetPhoto(id);

            if (photo.IsProfilePic)
                return BadRequest("This already is the profile pic!!");

            var currentProfilePic = await _repository.GetProfilePic(userId);
            currentProfilePic.IsProfilePic = false;

            photo.IsProfilePic = true;

            if (await _repository.SaveAll())
                return NoContent();
            return BadRequest("Updating Profile pic failed!!");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userId);

            if (!user.Photos.Any(x => x.PhotoId == id))
                return Unauthorized();

            var photo = await _repository.GetPhoto(id);

            if (photo.IsProfilePic)
                return BadRequest("Profile pic cannot be deleted!!");

            if (photo.PublicId != null)
            {
                var deletionParam = new DeletionParams(photo.PublicId);

                var delResult = _cloudinary.Destroy(deletionParam);

                if (delResult.Result == "ok")
                    _repository.Delete(photo);
            }
            else 
            {
                _repository.Delete(photo);
            }
            

            if (await _repository.SaveAll())
                return Ok();
            return BadRequest("Failed to delete the photo");
        }
    }
}