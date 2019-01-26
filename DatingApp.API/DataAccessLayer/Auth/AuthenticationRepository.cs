using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.DataAccessLayer.Auth
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly DataContext _context;
        public AuthenticationRepository(DataContext context)
        {
            this._context = context;

        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> UserExist(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Username == username))
                return true;
            return false;
        }

        #region Helper Methods
        
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // using helps call Dispose method which (in inheritance chain up) HMACSHA512 parent implements
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                // ComputeHash method takes byte array and hence we use GetBytes method
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }
        
        #endregion
    }
}