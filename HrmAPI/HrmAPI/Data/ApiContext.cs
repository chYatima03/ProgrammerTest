using Microsoft.EntityFrameworkCore;
using HrmAPI.Models;

namespace HrmAPI.Data
{
    public class ApiContext : DbContext
    {
        public DbSet<Departments> Departments { get; set; }
        public DbSet<Employees> Employees { get; set; }

        public ApiContext(DbContextOptions<ApiContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // กำหนด primary key สำหรับ Departments
            modelBuilder.Entity<Departments>().HasKey(d => d.Department_ID);
            modelBuilder.Entity<Employees>().HasKey(d => d.Employee_ID);

            // กำหนดค่าที่เพิ่มเติมถ้าจำเป็น
            // modelBuilder.Entity<Departments>().Property(d => d.Department_Name).IsRequired();

            base.OnModelCreating(modelBuilder);
        }
    }
}
