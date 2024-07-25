using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models
{
    public class Contribution
    {
        [Key]
        public int ContributionID { get; set; }
        public string UserID { get; set; }
        public int FacultyID { get; set; }
        public int EventID { get; set; }
        public string Title { get; set; }
        public DateTime SubmissionDate { get; set; }
        public DateTime ClosureDate { get; set; }
        public string Content { get; set; }
        public bool SelectedForPublication { get; set; }
        public bool Commented { get; set; }
        public int Likes { get; set; } // Số lượt thích
        public int Dislikes { get; set; } // Số lượt không thích
        public int Views { get; set; } // Số lượt xem
        public ContributionStatus Status { get; set; } // Trạng thái của bài báo
        [JsonIgnore]
        public User User { get; set; }
        public Faculty Faculty { get; set; }
        public Event Event { get; set; }
        public List<Comment> Comments { get; set; }
        public List<UploadedDocument> Documents { get; set; }
        public List<LikeDislike> LikeDislikes { get;set; }
    }
    public enum ContributionStatus
    {
        Good,
        Normal,
        Bad
    }
}
