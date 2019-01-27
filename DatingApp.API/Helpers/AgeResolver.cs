using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AgeResolver : IValueResolver<User, UserListDto, int>
    {
        public int Resolve(User source, UserListDto destination, int destMember, ResolutionContext context)
        {
            return Extensions.CalculateAge(source.DateOfBirth);
        }
    }
}