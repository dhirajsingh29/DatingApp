using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.DataAccessLayer.Auth;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationRepository _authRepository;
        private readonly IConfiguration _config;
        public AuthenticationController(IAuthenticationRepository repository, IConfiguration config)
        {
            _config = config;
            _authRepository = repository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
        {
            registerUserDto.Username = registerUserDto.Username.ToLower();

            if (await _authRepository.UserExist(registerUserDto.Username))
                return BadRequest("Username already taken");

            var newUser = new User
            {
                Username = registerUserDto.Username
            };
            var registeredUser = await _authRepository.Register(newUser, registerUserDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto loginUserDto)
        {
            var user = await _authRepository.Login(loginUserDto.Username.ToLower(), loginUserDto.Password);

            if (user == null)
                return Unauthorized();

            // token will have two claims
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            // server needs to validate if the token is valid or not when it comes back 
            // the serve needs to sign this token.
            // we are creating a security key and passing that security key 
            // as part of the SigningCredentials and encrypt the key with a hashing algorithm 
            var key = new SymmetricSecurityKey(Encoding.UTF8
                            .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // below a token descriptor is created using claims, signingCredentials etc.
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = signingCredentials
            };

            // following above steps, token is created below
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}