using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.DataAccessLayer.Auth
{
    public interface IAuthenticationRepository
    {
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExist(string username);
    }
}