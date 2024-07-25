using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // [Authorize(Roles = "Admin, Manager, Coordinator, Student, Guest")]
    //[Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController:ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<User> _userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            _roleManager = roleManager;
            _userManager=userManager;
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateRole([FromForm] CreateRoleDto createRoleDto)
        {
            if(string.IsNullOrEmpty(createRoleDto.RoleName))
            {
                return BadRequest("Role name is required");
            }

            var roleExist = await _roleManager.RoleExistsAsync(createRoleDto.RoleName);

            if(roleExist)
            {
                return BadRequest("Role already exist");
            }

            var roleResult = await _roleManager.CreateAsync(new IdentityRole(createRoleDto.RoleName));

            if(roleResult.Succeeded)
            {
                return Ok(new {message="Role Created successfully"});
            }

            return BadRequest("Role creation failed.");
            
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            // Lấy danh sách tất cả các vai trò
            var allRoles = await _roleManager.Roles.ToListAsync();

            // Khởi tạo danh sách để lưu trữ thông tin về vai trò và số lượng người dùng
            var rolesWithUsersCount = new List<RoleResponseDto>();

            // Lặp qua từng vai trò và tính toán số lượng người dùng
            foreach (var role in allRoles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
                var usersCount = usersInRole.Count;

                // Thêm thông tin về vai trò và số lượng người dùng vào danh sách
                rolesWithUsersCount.Add(new RoleResponseDto
                {
                    Id = role.Id,
                    Name = role.Name,
                    TotalUsers = usersCount
                });
            }

            // Trả về danh sách các vai trò với số lượng người dùng trong mỗi vai trò
            return Ok(rolesWithUsersCount);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole( string id)
        {
            // find role by their id
            var role = await _roleManager.FindByIdAsync(id);

            if(role is null)
            {
                return NotFound("Role not found.");
            }

            var result = await _roleManager.DeleteAsync(role);

            if(result.Succeeded)
            {
                return Ok( new {message="Role deleted successfully."});
            }

            return BadRequest("Role deletion failed.");
            
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole([FromForm] RoleAssignDto roleAssignDto)
        {
            var user = await _userManager.FindByIdAsync(roleAssignDto.UserId);

            if(user is null)
            {
                return NotFound("User not found.");
            }

            var role =await _roleManager.FindByIdAsync(roleAssignDto.RoleId);

            if(role is null)

            {
                return NotFound("Role not found.");
            }

            var result = await _userManager.AddToRoleAsync(user,role.Name!);

            if(result.Succeeded)
            {
                return Ok(new {message="Role assigned successfully"});
            }

            var error = result.Errors.FirstOrDefault();

            return BadRequest(error!.Description);
        }
    }
}