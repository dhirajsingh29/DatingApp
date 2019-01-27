using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DataAccessLayer.Dating;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repository.GetUser(id);
            var userToDisplay = _mapper.Map<UserDetailsDto>(user);
            return Ok(userToDisplay);
        }
    }
}