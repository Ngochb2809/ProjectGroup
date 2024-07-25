namespace API.Models
{
    public class LikeDislike
    {
        public int Id { get; set; }
        public int ContributionId { get; set; } 
        public string UserId { get; set; } 
        public bool Like { get; set; } 
        public bool Dislike { get; set; }
        public Contribution Contribution { get; set; }
    }
}
