namespace MovieTicket.Core.Models
{
    public class Seat
    {
        public int Id { get; set; }
        public int HallId { get; set; }
        public string Row { get; set; }
        public int Number { get; set; }

        
        public Hall Hall { get; set; }
    }
}