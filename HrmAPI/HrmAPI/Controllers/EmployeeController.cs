using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HrmAPI.Models;
using HrmAPI.Data;
using Microsoft.EntityFrameworkCore.Storage; // เพิ่ม namespace นี้

namespace HrmAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApiContext _context;
        private IDbContextTransaction? _transaction; // ประกาศ transaction เป็นฟิลด์ในคลาส
        public EmployeeController(ApiContext context)
        {
            _context = context;
        }
        //Create/Edit
        [HttpPost]
        public JsonResult CreateEdit(Employees emp)
        {
            using (_transaction = _context.Database.BeginTransaction())
            {
                try
                {
                   
                        var employeeeInDb = _context.Employees.Find(emp.Employee_ID);
                    if (employeeeInDb == null)
                    {
                        _context.Employees.Add(emp);
                    }
                    else
                    {

                        // Update specific properties
                        employeeeInDb.Department_ID = emp.Department_ID; // ตัวอย่างการอัปเดตชื่อ
                        employeeeInDb.Employee_Address = emp.Employee_Address; // ตัวอย่างการอัปเดตที่อยู่
                        employeeeInDb.Employee_First_name = emp.Employee_First_name;
                        employeeeInDb.Employee_Last_name = emp.Employee_Last_name;
                        employeeeInDb.Date_of_Birth = emp.Date_of_Birth;
                        employeeeInDb.Date_Joined = emp.Date_Joined;
                        employeeeInDb.Photo = emp.Photo;
                        employeeeInDb.Gender = emp.Gender;

                    }
                    _context.SaveChanges();
                    _transaction.Commit(); // Commit the transaction if everything is successful
                    return new JsonResult(Ok(emp));
                }
                catch (Exception ex)
                {
                    _transaction.Rollback(); // Rollback the transaction if there is an error
                    // Log the exception
                    return new JsonResult(StatusCode(StatusCodes.Status500InternalServerError,
                        "An error occurred while processing your request. Please try again later."));
                }
            }
        }

        //GET
        [HttpGet]
        public JsonResult Get(string id)
        {
            try
            {
                var result = _context.Employees.Find(id);
                if (result == null)
                {
                    return new JsonResult(NotFound());
                }
                return new JsonResult(Ok(result));
            }
            catch (Exception ex)
            {
                // Log the exception
                return new JsonResult(StatusCode(StatusCodes.Status500InternalServerError,
                    "An error occurred while processing your request. Please try again later."));
            }
        }

        //Delete
        [HttpDelete]
        public JsonResult Delete(string id)
        {
            using (_transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var result = _context.Employees.Find(id);
                    if (result == null)
                    {
                        return new JsonResult(NotFound());
                    }
                    _context.Employees.Remove(result);
                    _context.SaveChanges();
                    _transaction.Commit(); // Commit the transaction if successful

                    return new JsonResult(NoContent());
                }
                catch (Exception ex)
                {
                    _transaction.Rollback(); // Rollback the transaction if there is an error
                    // Log the exception
                    return new JsonResult(StatusCode(StatusCodes.Status500InternalServerError,
                        "An error occurred while processing your request. Please try again later."));
                }
            }
        }

        //Get all
        [HttpGet()]
        public JsonResult GetAll(int? page = null, int itemsPerPage = 10, string? searchTerm = "")
        {
            try
            {
                // Perform an inner join between Employees and Departments
                var query = from employee in _context.Employees
                            join department in _context.Departments on employee.Department_ID equals department.Department_ID
                            select new
                            {
                                employee.Employee_ID,
                                employee.Employee_First_name,
                                employee.Employee_Last_name,
                                employee.Employee_Address,
                                employee.Date_of_Birth,
                                employee.Date_Joined,
                                employee.Gender,
                                employee.Photo,
                                DepartmentName = department.Department_Name // Assuming department.Name is the property for the department name
                            };

                // If searchTerm is provided, filter the results
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(d => d.Employee_ID.Contains(searchTerm) ||
                                             d.Employee_First_name.Contains(searchTerm) ||
                                             d.Employee_Last_name.Contains(searchTerm) ||
                                             d.Employee_Address.Contains(searchTerm) ||
                                             d.DepartmentName.Contains(searchTerm)); // Include department name in the search
                }

                // Calculate the total number of records that match the criteria
                var totalRecords = query.Count();

                // Handle pagination if page and itemsPerPage are provided
                if (page.HasValue)
                {
                    query = query.Skip((page.Value - 1) * itemsPerPage).Take(itemsPerPage);
                }

                var employees = query.ToList();
                var result = new
                {
                    value = employees,
                    totalCount = totalRecords,
                    totalPages = page.HasValue ? (int)Math.Ceiling((double)totalRecords / itemsPerPage) : 1
                };

                return new JsonResult(Ok(result));
            }
            catch (Exception ex)
            {
                // Log the exception
                return new JsonResult(StatusCode(StatusCodes.Status500InternalServerError,
                    "An error occurred while processing your request. Please try again later."));
            }
        }

    }
}
