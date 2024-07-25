namespace API.Models
{
    public class Notification
    {
        public int NotificationID { get; set; }
        public string UserID { get; set; }
        public int ContributionID { get; set; }
        public NotificationType NotificationType { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public User User { get; set; }

    }
    public enum NotificationType
    {
        Like,
        DisLike,
        Comment
    }
}
