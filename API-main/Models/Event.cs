using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Event
    {
        [Key]
        public int EventID { get; set; }
        public string EventName { get; set; }
        public DateTime FirstClosureDate { get; set; }
        public DateTime FinalClosureDate { get; set; }
        public int DurationBetweenClosure { get; set; }
        public int FacultyID { get; set; }
        public Faculty Faculty { get; set; }
        public List<Contribution> Contributions { get; set;}
    }
}
