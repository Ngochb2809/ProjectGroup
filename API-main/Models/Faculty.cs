using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Faculty
    {
        [Key]
        public int FacultyID { get; set; }
        public string FacultyName { get; set; }

        public List<Contribution> Contributions { get; set; }
        public List<Event> Events { get; set; }
    }
}
