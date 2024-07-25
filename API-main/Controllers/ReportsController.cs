using API.Data;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reports/contributions
        [HttpGet("contributions")]
        public async Task<ActionResult<ContributionStatistics>> GetContributionReports()
        {
            var statistics = new ContributionStatistics
            {
                TotalContributions = await _context.Contributions.CountAsync(),
                TotalViews = await _context.Contributions.SumAsync(c => c.Views),
                TotalLikes = await _context.Contributions.SumAsync(c => c.Likes),
                TotalDislikes = await _context.Contributions.SumAsync(c => c.Dislikes)
            };

            return statistics;
        }

        // GET: api/reports/users
        [HttpGet("users")]
        public async Task<ActionResult<UserStatistics>> GetUserReports()
        {
            var userStatistics = new UserStatistics
            {
                TotalUsers = await _context.Users.CountAsync(),
                UsersByRole = await _context.Users
                    .GroupBy(u => u.RoleName)
                    .Select(g => new UserRoleCount { Role = g.Key, Count = g.Count() })
                    .ToListAsync()
            };

            return userStatistics;
        }
    }
}
