namespace HrmAPI.Models
{
    public class Employees
    {
        public string Employee_ID { get; set; }
        public int Department_ID { get; set; }
        public string? Employee_First_name { get; set; }
        public string? Employee_Last_name { get; set; }
        public string? Gender { get; set; }
        public DateTime Date_of_Birth { get; set; } 
        public DateTime Date_Joined { get; set; }
        public string? Employee_Address { get; set; }
        public string? Photo { get; set; }
    }
}
