import api from "./api";

// GET /v1/bookings - backend auto-filters by JWT token (admin sees all, client sees own)
export const getMyBookings = () => api.get("/bookings");

// POST /v1/bookings - clientId comes from JWT, NOT query param
export const createBooking = (data) => api.post("/bookings", data);

// DELETE /v1/bookings/{id}?reason=... - reason is a query param, NOT body
export const cancelBooking = (id, reason) =>
  api.delete(`/bookings/${id}`, { params: { reason } });

// PATCH /v1/bookings/{id}/status?status=... - for admin
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, null, { params: { status } });
