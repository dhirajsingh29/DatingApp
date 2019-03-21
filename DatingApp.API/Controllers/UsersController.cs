using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DataAccessLayer.Dating;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
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
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repository.GetUsers();
            var usersToDisplay = _mapper.Map<IEnumerable<UserListDto>>(users);
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
    }
}