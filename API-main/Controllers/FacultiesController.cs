using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.Dtos;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FacultiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFaulty()
        {
            var allFacultys = await _context.Faculties.ToListAsync();

            var falcultys = new List<FacultyDto>();
            foreach (var f in allFacultys)
            {
                falcultys.Add(new FacultyDto
                {
                    ID = f.FacultyID,
                    FacultyName = f.FacultyName
                });
            }

            return Ok(falcultys);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddFaculty([FromForm] FacultyDto facultyDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var faculty = new Faculty
            {
                FacultyName = facultyDto.FacultyName
            };

            _context.Faculties.Add(faculty);
            await _context.SaveChangesAsync();

            return Ok(faculty);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateFaculty( int id, [FromForm] FacultyDto facultyDto)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null)
            {
                return NotFound();
            }

            faculty.FacultyName = facultyDto.FacultyName;

            _context.Faculties.Update(faculty);
            await _context.SaveChangesAsync();

            return Ok(faculty);
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null)
            {
                return NotFound();
            }

            _context.Faculties.Remove(faculty);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
