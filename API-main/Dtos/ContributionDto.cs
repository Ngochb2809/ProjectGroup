using API.Models;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ContributionDto
    {
        [Key]
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
        public int EventID { get; set; }
        public List<UploadedDocumentDto> UploadedDocuments { get; set; }
        public ContributionStatus Status { get; set; }
    }
    public class UploadedDocumentDto
    {
        public int Id { get; set; }
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
    }
}
