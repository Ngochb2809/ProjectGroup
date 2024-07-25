namespace API.Models
{
    public class LikeDislikeComment
    {
        public int Id { get; set; }
        public int CommentId { get; set; }
        public string UserId { get; set; }
        public bool Like { get; set; }
        public bool Dislike { get; set; }
        public Comment Comment { get; set; }
    }
}
