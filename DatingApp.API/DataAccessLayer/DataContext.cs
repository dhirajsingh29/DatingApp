using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.DataAccessLayer
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base (options) {}

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            /* Like entity has two Ids, so EF will not be able to make any one of them as Primary Key.
             * Hence, we need to make composite primary key.
             */
            builder.Entity<Like>()
                .HasKey(x => new { x.LikerId, x.LikeeId });
            
            /* one likee can have multiple likers, hence we use Fluent API to achieve the same. */
            builder.Entity<Like>()
                .HasOne(x => x.Likee)
                .WithMany(x => x.Likers)
                .HasForeignKey(x => x.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
            
            /* one liker can have many likees, hence here too Fluent API to achieve the same. */
            builder.Entity<Like>()
                .HasOne(x => x.Liker)
                .WithMany(x => x.Likees)
                .HasForeignKey(x => x.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}