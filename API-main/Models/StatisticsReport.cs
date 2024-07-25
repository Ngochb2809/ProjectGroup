namespace API.Models
{
    public class StatisticsReport
    {
        public int StatisticsReportID { get; set; }
        public int FacultyId { get; set; } // ID của khoa
        public int NumberOfContributions { get; set; }
        public double PercentageOfContribution { get; set; }
        public int NumberOfContributors { get; set; }
        public Faculty Faculty { get; set; }

    }
}
