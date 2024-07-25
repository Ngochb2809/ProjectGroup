namespace API.Dtos
{
    public class FacultyContributionStatisticsDTO
    {
        public int FacultyId { get; set; }
        public string FacultyName { get; set; }
        public int NumberOfContributions { get; set; }
        public double PercentageOfContribution { get; set; }
        public int NumberOfContributors { get; set; }
    }
}
