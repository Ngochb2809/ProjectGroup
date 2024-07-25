using System.IO.Compression;
using API.Data;
using API.Models;
using API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Reflection;
using System.Collections.Generic;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DashboardController(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/dashboard/contributions/latest
        [HttpGet("contributions/latest")]
        public ActionResult<IEnumerable<Contribution>> GetLatestContributions()
        {
            var latestContributions = _context.Contributions.OrderByDescending(c => c.SubmissionDate).Take(10).ToList();
            return latestContributions;
        }

        // GET: api/dashboard/contributions/byfaculty
        [HttpGet("contributions/byfaculty")]
        public ActionResult<IEnumerable<object>> GetContributionsByFaculty()
        {
            var contributionsByFaculty = _context.Contributions
                .GroupBy(c => c.FacultyID)
                .Select(g => new
                {
                    FacultyId = g.Key,
                    FacultyName = g.FirstOrDefault().Faculty.FacultyName,
                    NumberOfContributions = g.Count()
                })
                .ToList();

            return contributionsByFaculty;
        }

        // GET: api/dashboard/contributions/popular
        [HttpGet("contributions/popular")]
        public ActionResult<IEnumerable<Contribution>> GetPopularContributions()
        {
            var popularContributions = _context.Contributions.OrderByDescending(c => (c.Likes + c.Dislikes)).Take(10).ToList();
            return popularContributions;
        }

        // GET: api/dashboard/contributions/mostviewed
        [HttpGet("contributions/mostviewed")]
        public ActionResult<IEnumerable<Contribution>> GetMostViewedContributions()
        {
            var mostViewedContributions = _context.Contributions.OrderByDescending(c => c.Views).Take(10).ToList();
            return mostViewedContributions;
        }

        // GET: api/dashboard/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<DashboardStatisticsDTO>> GetDashboardStatistics()
        {
            var dashboardStatistics = new DashboardStatisticsDTO();

            // Calculate total statistics
            dashboardStatistics.TotalContributions = await _context.Contributions.CountAsync();
            dashboardStatistics.TotalViews = await _context.Contributions.SumAsync(c => c.Views);
            dashboardStatistics.TotalLikes = await _context.Contributions.SumAsync(c => c.Likes);
            dashboardStatistics.TotalDislikes = await _context.Contributions.SumAsync(c => c.Dislikes);

            // Calculate faculty-wise statistics
            dashboardStatistics.FacultyContributions = await _context.Faculties
                .Select(f => new FacultyContributionStatisticsDTO
                {
                    FacultyId = f.FacultyID,
                    FacultyName = f.FacultyName,
                    NumberOfContributions = f.Contributions.Count(),
                    PercentageOfContribution = (double)f.Contributions.Count() / dashboardStatistics.TotalContributions * 100,
                    NumberOfContributors = f.Contributions.Select(c => c.UserID).Distinct().Count()
                })
                .ToListAsync();

            return dashboardStatistics;
        }

        // GET: api/dashboard/export/statistics
        [HttpGet("export/statistics/zip")]
        public async Task<IActionResult> ExportStatisticsZip()
        {
            // Export dashboard statistics to images in JPG, PNG format
            // (Not implemented)

            // Export uploaded documents to a ZIP file
            var documents = await _context.UploadedDocuments.ToListAsync();
            var tempFolderPath = Path.Combine(Path.GetTempPath(), "ExportedFiles");
            Directory.CreateDirectory(tempFolderPath);

            var zipFilePath = Path.Combine(Path.GetTempPath(), $"ExportedFiles_{DateTime.Now:yyyyMMddHHmmss}.zip");

            using (var archive = ZipFile.Open(zipFilePath, ZipArchiveMode.Create))
            {
                foreach (var document in documents)
                {
                    var fileName = $"Document_{document.Id}{GetFileExtension(document.ContentType)}";
                    var filePath = Path.Combine(tempFolderPath, fileName);
                    await System.IO.File.WriteAllBytesAsync(filePath, document.Content);

                    archive.CreateEntryFromFile(filePath, fileName);
                }
            }

            // Export database tables to an Excel file (Not implemented)

            // Return the ZIP file to the client
            var memoryStream = new MemoryStream();
            using (var stream = new FileStream(zipFilePath, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;

            return File(memoryStream, "application/zip", "ExportedFiles.zip");
        }

        private string GetFileExtension(string contentType)
        {
            switch (contentType)
            {
                case "application/msword":
                    return ".doc";
                case "image/jpeg":
                    return ".jpg";
                case "image/png":
                    return ".png";
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    return ".doc";
                // Add more content types as needed
                default:
                    return ".dat"; // Default to .dat extension if content type is unknown
            }
        }
        // GET: api/dashboard/export/statistics
        [HttpGet("export/statistics/excel")]
        public async Task<IActionResult> ExportStatisticsExcel()
        {

            // Export database tables to an Excel file (Not implemented)
            var excelFilePath = Path.Combine(Path.GetTempPath(), $"ExportedExcel_{DateTime.Now:yyyyMMddHHmmss}.xlsx");

            using (var package = new ExcelPackage(new FileInfo(excelFilePath)))
            {
                // Add tables to Excel file
                await AddTablesToExcel(package, _context);
                package.Save();
            }

            // Return the Excel file to the client
            var memoryStream = new MemoryStream();
            using (var stream = new FileStream(excelFilePath, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;

            return File(memoryStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExportedExcel.xlsx");
        }

        // Method to add tables to Excel file
        private async Task AddTablesToExcel(ExcelPackage package, AppDbContext dbContext)
        {
            var properties = typeof(AppDbContext).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(prop => prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));

            foreach (var prop in properties)
            {
                var entityType = prop.PropertyType.GetGenericArguments()[0];
                var worksheet = package.Workbook.Worksheets.Add(entityType.Name);

                // Get entity data
                var query = (IQueryable<object>)prop.GetValue(dbContext);
                var entities = await Task.Run(() => query.ToList());

                // Get property names
                var propertyNames = entityType.GetProperties().Select(p => p.Name).ToList();

                // Write entity data to Excel
                var dataList = new List<List<string>>();
                foreach (var entity in entities)
                {
                    var rowData = new List<string>();
                    foreach (var propertyName in propertyNames)
                    {
                        var property = entityType.GetProperty(propertyName);
                        if (property != null)
                        {
                            var propertyValue = property.GetValue(entity);
                            rowData.Add(propertyValue?.ToString() ?? "");
                        }
                        else
                        {
                            rowData.Add("");
                        }
                    }
                    dataList.Add(rowData);
                }
                // Convert List<List<string>> to List<object[]>
                var dataObjects = dataList.Select(row => row.Cast<object>().ToArray()).ToList();

                // Load dataObjects into Excel worksheet
                worksheet.Cells.LoadFromArrays(dataObjects);
            }
        }

        // Method to get DbSet for an entity type
        private dynamic GetDbSetForEntityType(AppDbContext dbContext, Type entityType)
        {
            var dbSetProperty = dbContext.GetType().GetProperties()
                .FirstOrDefault(p => p.PropertyType.IsGenericType && p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>) && p.PropertyType.GenericTypeArguments[0] == entityType);

            if (dbSetProperty != null)
            {
                return dbSetProperty.GetValue(dbContext);
            }

            throw new InvalidOperationException($"DbSet<{entityType.Name}> not found in DbContext.");
        }
    }
    
}
