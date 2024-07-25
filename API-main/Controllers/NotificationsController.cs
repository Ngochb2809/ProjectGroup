using API.Data;
using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public NotificationsController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        //// GET: api/notifications
        //[HttpGet]
        //[Authorize(Roles = "Student")]
        //public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotifications()
        //{
        //    var currentUser = await _userManager.GetUserAsync(User);
        //    if (currentUser == null)
        //    {
        //        return Unauthorized();
        //    }

        //    var notifications = await _context.Notifications
        //        .Where(n => n.UserID == currentUser.Id)
        //        .Select(n => new NotificationDTO
        //        {
        //            NotificationID = n.NotificationID,
        //            NotificationType = n.NotificationType,
        //            Content = n.Content,
        //            Date = n.Date
        //        })
        //        .ToListAsync();

        //    return notifications;
        //}

        // POST: api/notifications
        //[HttpPost]
        //[Authorize(Roles = "MarketingCoordinator")]
        //public async Task<ActionResult<Notification>> PostNotification([FromForm] NotificationDTO notificationDTO)
        //{
        //    var users = await _userManager.GetUsersInRoleAsync("Student");
        //    var notifications = new List<Notification>();

        //    foreach (var user in users)
        //    {
        //        var notification = new Notification
        //        {
        //            UserID = user.Id,
        //            NotificationType = notificationDTO.NotificationType,
        //            Content = notificationDTO.Content,
        //            Date = DateTime.Now
        //        };
        //        notifications.Add(notification);
        //    }

        //    _context.Notifications.AddRange(notifications);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetNotifications), notifications);
        //}
    }
}
