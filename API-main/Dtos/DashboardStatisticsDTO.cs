namespace API.Dtos
{
    public class DashboardStatisticsDTO
    {
        public int TotalContributions { get; set; }
        public int TotalViews { get; set; }
        public int TotalLikes { get; set; }
        public int TotalDislikes { get; set; }
        public List<FacultyContributionStatisticsDTO> FacultyContributions { get; set; }
    }
}
