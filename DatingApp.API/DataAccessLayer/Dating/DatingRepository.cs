using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.DataAccessLayer.Dating
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            this._context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
                .FirstOrDefaultAsync(x => x.LikerId == userId && x.LikeeId == recipientId);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(x => x.PhotoId == id);
            return photo;
        }

        public async Task<Photo> GetProfilePic(int userId)
        {
            return await _context.Photos
                        .Where(x => x.UserId == userId).FirstOrDefaultAsync(x => x.IsProfilePic); 
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }

        // public async Task<IEnumerable<User>> GetUsers()
        // {
        //     var users = await _context.Users.Include(p => p.Photos).ToListAsync();
        //     return users;
        // }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            // either of the below way can be used

            // var users = _context.Users.Include(p => p.Photos)
            //             .Where(x => x.Id != userParams.UserId && x.Gender == userParams.Gender);

            var users = _context.Users.Include(p => p.Photos)
                .OrderByDescending(x => x.LastActive).AsQueryable();
            users = users.Where(x => x.Id != userParams.UserId && x.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var likers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(x => likers.Contains(x.Id));
            }

            if (userParams.Likees)
            {
                var likees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(x => likees.Contains(x.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 60)
            {
                var minDob = System.DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = System.DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch(userParams.OrderBy)
                {
                    case "createDate":
                        users = users.OrderByDescending(x => x.CreateDate);
                        break;
                    default:
                        users = users.OrderByDescending(x => x.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(x => x.Likers).Include(x => x.Likees)
                .FirstOrDefaultAsync(x => x.Id == id);
            
            if (likers)
            {
                return user.Likers.Where(x => x.LikeeId == id).Select(x => x.LikerId);
            }
            else
            {
                return user.Likees.Where(x => x.LikerId == id).Select(x => x.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<Message>> GetMessages(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(x => x.Sender).ThenInclude(x => x.Photos)
                .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                .AsQueryable();

            switch(messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(x => x.RecipientId == messageParams.UserId 
                        && x.DeletedByRecipient == false);
                    break;
                
                case "Outbox":
                    messages = messages.Where(x => x.SenderId == messageParams.UserId 
                        && x.DeletedBySender == false);
                    break;
                
                default:
                    messages = messages.Where(x => x.RecipientId == messageParams.UserId && x.IsRead == false 
                        && x.DeletedByRecipient ==  false);
                    break;
            }

            messages = messages.OrderByDescending(x => x.MessageSent);
            return await PagedList<Message>
                        .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessagesThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(x => x.Sender).ThenInclude(x => x.Photos)
                .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                .Where(x => x.RecipientId == userId && x.DeletedByRecipient == false 
                        && x.SenderId == recipientId
                    || x.RecipientId == recipientId && x.SenderId == userId 
                        && x.DeletedBySender == false)
                .OrderByDescending(x => x.MessageSent).ToListAsync();

            return messages;
        }
    }
}