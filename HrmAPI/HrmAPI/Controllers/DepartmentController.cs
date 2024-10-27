using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HrmAPI.Models;
using HrmAPI.Data;

namespace HrmAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly ApiContext _context;
        public DepartmentController(ApiContext context)
        {
            _context = context;
        }

        // Create/Edit
        [HttpPost]
        public JsonResult CreateEdit(Departments depart)
        {
            if (depart.Department_ID == 0)
            {
                _context.Departments.Add(depart);
            }
            else
            {
                var departmentInDb = _context.Departments.Find(depart.Department_ID);
                
                if(departmentInDb == null)
                {
                    return new JsonResult(NotFound());
                }

                departmentInDb.Department_Name = depart.Department_Name; // ตัวอย่างการอัปเดตชื่อ
                departmentInDb.Department_Address = depart.Department_Address; // ตัวอย่างการอัปเดตที่อยู่
            }

            _context.SaveChanges();

            return new JsonResult(Ok(depart));
        }

        //GET
        [HttpGet]
        public JsonResult Get(int id)
        {
            var result = _context.Departments.Find(id);
            if (result == null)
            {
                return new JsonResult(NotFound());
            }
            return new JsonResult(Ok(result));
        }

        //Delete
        [HttpDelete]
        public JsonResult Delete(int id)
        {
            var result = _context.Departments.Find(id);

            if (result == null)
            {
                return new JsonResult(NotFound());
            }
            _context.Departments.Remove(result);
            _context.SaveChanges();

            return new JsonResult(NoContent());
        }

        [HttpGet]
        public JsonResult GetAll(int? page = null, int itemsPerPage = 10, string? searchTerm = "")
        {
            var query = _context.Departments.AsQueryable();

            // ถ้ามี searchTerm ให้ค้นหา
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(d => d.Department_Name.Contains(searchTerm) || d.Department_Address.Contains(searchTerm));
            }

            // คำนวณค่าจำนวนทั้งหมดของแผนกที่ตรงกับเงื่อนไข
            var totalRecords = query.Count();

            // ถ้ามี page และ itemsPerPage ให้แบ่งหน้า
            if (page.HasValue)
            {
                query = query.Skip((page.Value - 1) * itemsPerPage).Take(itemsPerPage);
            }

            var departments = query.ToList();
            var result = new
            {
                value = departments,
                totalCount = totalRecords,
                totalPages = page.HasValue ? (int)Math.Ceiling((double)totalRecords / itemsPerPage) : 1
            };

            return new JsonResult(Ok(result));
        }

    }
}
