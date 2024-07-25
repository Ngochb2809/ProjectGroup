using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ContributionStatistics
    {
        [Key] // Thêm attribute này để chỉ định trường dưới là khóa chính
        public int ContributionStatisticsID { get; set; } // Thay vì ContributionStatisticsID, bạn có thể đặt tên khóa chính là bất kỳ thứ gì bạn muốn
        public int TotalContributions { get; set; } // Tổng số bài báo
        public int TotalViews { get; set; } // Tổng số lượt xem
        public int TotalLikes { get; set; } // Tổng số lượt thích
        public int TotalDislikes { get; set; } // Tổng số lượt không thích
    }
}
