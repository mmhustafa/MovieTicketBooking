# 🎬 Movie Ticket Booking System  

A full-stack application for browsing movies, selecting seats, and booking tickets.  
- **Frontend:** Angular (UI for users)  
- **Backend:** ASP.NET Core Web API (N-Tier architecture with clean separation of concerns)  

---

## 🚀 Features  

- Browse movies & showtimes  
- View movie details  
- Select seats in a seat map  
- Booking summary with total price  
- Secure login & registration (JWT authentication)  
- View past bookings  

---

## 🛠 Tech Stack  

### Frontend (Angular)  
- Angular 17+  
- Angular Material / Bootstrap (UI components)  
- Routing & Guards  
- HttpClient for API calls  
- Reactive Forms  

### Backend (.NET 8 Web API, N-Tier)  
- ASP.NET Core Web API  
- Entity Framework Core + SQL Server  
- ASP.NET Identity + JWT Authentication  
- N-Tier structure (Presentation, Application, Domain, Infrastructure)  

---
## 📂 Project Structure

```plaintext
movie-ticket-booking/
├── frontend/                               (Angular App)
│   └── src/app/
│       ├── components/
│       ├── services/
│       └── app-routing.module.ts
│
├── backend/                                (ASP.NET Core Web API, N-Tier)
│   ├── MovieBooking.sln
│   │
│   ├── MovieBooking.Presentation/          ← API Layer (Controllers, Startup)
│   │   ├── Controllers/
│   │   └── Program.cs
│   │
│   ├── MovieBooking.Application/           ← Business Logic Layer
│   │   └── Services/
│   │
│   ├── MovieBooking.Domain/                ← Domain Layer
│   │   ├── Entities/
│   │   └── Interfaces/
│   │
│   └── MovieBooking.Infrastructure/        ← Data Access Layer
│       ├── Context/
│       ├── Repositories/
│       └── Migrations/

