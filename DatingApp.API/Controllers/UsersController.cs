using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DataAccessLayer.Dating;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(UserActivityLogger))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repository, IMapper mapper)
        {
            this._repository = repository;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var loggedInUser = await _repository.GetUser(loggedInUserId);

            userParams.UserId = loggedInUserId;
            if (string.IsNullOrEmpty(userParams.Gender))
                userParams.Gender = loggedInUser.Gender == "female" ? "male" : "female";

            var users = await _repository.GetUsers(userParams);
            var usersToDisplay = _mapper.Map<IEnumerable<UserListDto>>(users);

            Response.Pagination(users.CurrentPage, users.PageSize,
                users.TotalCount, users.TotalPages);

            return Ok(usersToDisplay);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repository.GetUser(id);
            var userToDisplay = _mapper.Map<UserDetailsDto>(user);
            return Ok(userToDisplay);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto userDetailsForUpdate)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var user = await _repository.GetUser(id);

            _mapper.Map(userDetailsForUpdate, user);

            if (await _repository.SaveAll())
                return NoContent();
            
            throw new Exception($"Updating {user.Nickname}'s details failed");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var like = await _repository.GetLike(id, recipientId);
            if (like != null)
                return BadRequest("You have already liked this user!!");

            if (await _repository.GetUser(recipientId) == null)
                return NotFound();
            
            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _repository.Add<Like>(like);

            if (await _repository.SaveAll())
                return Ok();
            return BadRequest("Like functionality faced some issue!!"); 
        }
    }
}