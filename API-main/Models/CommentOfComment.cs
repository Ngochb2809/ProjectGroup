using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class CommentOfComment
    {
        [Key]
        public int Id { get; set; }
        public int CommentId { get; set; } // ID của bài báo
        public string UserId { get; set; } // ID của người dùng (sinh viên hoặc ẩn danh)
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public bool IsAnonymous { get; set; } // Xác định liệu bình luận này có phải ẩn danh hay không
        public bool Hidden { get; set; } // Xác định liệu bình luận này đã bị ẩn đi hay không
        public Comment Comment { get; set; }
    }
}
