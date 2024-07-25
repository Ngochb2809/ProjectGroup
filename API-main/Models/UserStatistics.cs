namespace API.Models
{
    public class UserStatistics
    {
        public int TotalUsers { get; set; }
        public List<UserRoleCount> UsersByRole { get; set; }
    }
    public class UserRoleCount
    {
        public string Role { get; set; }
        public int Count { get; set; }
    }
}
