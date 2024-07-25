using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class User:IdentityUser
    {
        public string? FullName { get; set; }
        public int FacultyID { get; set; }
        public bool ReceiveNotifications { get; set; }
        public string RoleName { get; set; }
        public List<Contribution> Contributions { get; set; }
        public List<Notification> Notifications { get; set; }
    }
}