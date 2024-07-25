using API.Models;
namespace API.Dtos
{
    public class NotificationDTO
    {
        public int NotificationID { get; set; }
        public string UserID { get; set; }
        public int ContributionID { get; set; }
        public NotificationType NotificationType { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
    }
    
}
