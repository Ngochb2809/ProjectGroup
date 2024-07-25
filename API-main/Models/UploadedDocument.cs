namespace API.Models
{
    public class UploadedDocument
    {
        public int Id { get; set; }
        public int ContributionId { get; set; }
        public byte[] Content { get; set; } // Nội dung của tài liệu dưới dạng byte array
        public string ContentType { get; set; } // Định dạng của tài liệu (ví dụ: "application/msword", "image/jpeg",...)
        public Contribution Contribution { get; set; }
    }
}
