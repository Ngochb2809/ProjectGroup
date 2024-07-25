using API.Models;

namespace API.Dtos
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public int ContributionId { get; set; } // ID của bài báo
        public string UserId { get; set; } // ID của người dùng (sinh viên hoặc ẩn danh)
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public bool IsAnonymous { get; set; } // Xác định liệu bình luận này có phải ẩn danh hay không
        //public bool Hidden { get; set; } // Xác định liệu bình luận này đã bị ẩn đi hay không
        public int Likes { get; set; } // Số lượt thích
        public int Dislikes { get; set; } // Số lượt không thích
    }
}
