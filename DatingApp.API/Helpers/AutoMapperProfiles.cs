using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserListDto>()
                .ForMember(dest => dest.PicUrl, option =>
                {
                    option.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsProfilePic).Url);
                })
                .ForMember(dest => dest.Age, option => {
                    // the commented methos is a way in which we need to use a Resolver.
                    option.MapFrom<AgeResolver>();                    
                });
            CreateMap<User, UserDetailsDto>()
                .ForMember(dest => dest.PicUrl, option =>
                {
                    option.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsProfilePic).Url);
                })
                .ForMember(dest => dest.Age, option => {                    
                    option.MapFrom((src, dest) => src.DateOfBirth.CalculateAge());            
                });
            CreateMap<Photo, PhotoDetailsDto>();
            CreateMap<UpdateUserDto, User>();
            CreateMap<PhotoCreationDto, Photo>();
            CreateMap<Photo, PhotoToReturnDto>();
            CreateMap<RegisterUserDto, User>();
            CreateMap<CreateMessageDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(x => x.SenderPicUrl,
                    options => options.MapFrom(x => x.Sender.Photos.FirstOrDefault(p => p.IsProfilePic).Url))
                .ForMember(x => x.RecipientPicUrl,
                    options => options.MapFrom(x => x.Recipient.Photos.FirstOrDefault(p => p.IsProfilePic).Url));
        }
    }
}