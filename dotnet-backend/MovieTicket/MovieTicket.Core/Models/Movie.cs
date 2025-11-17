using System;
using System.Collections.Generic;
using System.Text;

namespace MovieTicket.Core.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Genre { get; set; }
        public string Duration { get; set; }
        public string Year { get; set; }
        public string PosterUrl { get; set; }
        public string StoryLine { get; set; }
        public string Status { get; set; }
        public double Rating { get; set; }


        public ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();

    }
}
