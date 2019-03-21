using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.DataAccessLayer.Dating;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class UserActivityLogger : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // next() call marks that we are awaiting till the Action has been completed;
            // after which we can use resultContext
            var resultContext = await next();

            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            // we use RequestServices because repository is being provided as dependency injection 
            // inside Statup class
            var repository = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await repository.GetUser(userId); 
            user.LastActive = System.DateTime.Now;
            await repository.SaveAll();
        }
    }
}