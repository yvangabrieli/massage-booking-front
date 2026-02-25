# Tokame Frontend

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Make sure the backend is running
```bash
# In your backend folder:
mvn spring-boot:run
# Backend will be at: http://localhost:8080
```

### 3. Start the frontend
```bash
npm run dev
# Frontend will be at: http://localhost:5173
```

The Vite proxy automatically forwards all `/api` requests to `http://localhost:8080`
so no CORS issues and no hardcoded URLs needed.

---

## Test Accounts (from data.sql seed)

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@massage.com | Admin123! |
| Client | john@example.com | Admin123! |

---

## All Endpoints Connected

| Page | Endpoint |
|------|----------|
| Login | POST /api/v1/auth/login |
| Register | POST /api/v1/auth/register |
| Booking page | GET /api/v1/services |
| Booking page | POST /api/v1/bookings |
| Booking page | GET /api/v1/bookings (auto-filtered by JWT) |
| Booking page | DELETE /api/v1/bookings/{id}?reason=... |
| Admin → Reservas | GET /api/v1/bookings |
| Admin → Reservas | PATCH /api/v1/bookings/{id}/status?status=... |
| Admin → Reservas | DELETE /api/v1/bookings/{id} |
| Admin → Clientes | GET /api/v1/clients |
| Admin → Clientes | DELETE /api/v1/clients/{id} |
| Admin → Servicios | GET /api/v1/services |
| Admin → Servicios | POST /api/v1/services |
| Admin → Servicios | DELETE /api/v1/services/{id} |
| Availability | GET /api/v1/availability/slots?date=... |

---

## Adding Your Photos

Place your images inside the `public/` folder:
- `public/hero.png` → hero section (already there)
- `public/yvan-1.png` → "Quien soy" section (already there)
- `public/logo.png` → header logo (already there)

To swap a photo, just replace the file with the same name.
To add a new one, drop it in `public/` and reference it as `/your-photo.jpg` in JSX.
