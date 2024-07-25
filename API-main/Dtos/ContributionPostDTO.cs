using API.Models;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ContributionPostDTO
    {
        public int ContributionId { get; set; }
        public string Title { get; set; }
        public DateTime SubmissionDate { get; set; }
        public DateTime ClosureDate { get; set; }
        public string Content { get; set; }
        public bool SelectedForPublication { get; set; }
        public bool Commented { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public bool isLike { get; set; }
        public bool isDislike { get; set; }
        public int Views { get; set; }
        public int Status { get; set; }
        public int EventID { get; set; }
    }
}
