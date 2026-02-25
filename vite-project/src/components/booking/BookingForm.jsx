import { useState } from "react";

const BookingForm = ({ service, onSubmit, loading }) => {
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");

  const handleBooking = () => {
    setError("");

    if (!service) return setError("Selecciona un servicio primero");

    const start = new Date(dateTime);
    const now = new Date();

    if (isNaN(start.getTime())) return setError("Selecciona una fecha y hora");

    const diffHours = (start - now) / (1000 * 60 * 60);
    if (diffHours < 2) return setError("Debes reservar con al menos 2 horas de antelación");
    if (diffHours > 24 * 90) return setError("No puedes reservar con más de 3 meses de antelación");

    // FIX: send ONLY serviceId + startTime — NO endTime (backend calculates it)
    onSubmit({
      serviceId: service.id,
      startTime: start.toISOString().slice(0, 19), // "2025-06-15T10:00:00"
    });

    setDateTime("");
  };

  if (!service) return null;

  return (
    <div className="card p-4 mb-4">
      <h5 className="mb-3">
        Reservar: <strong>{service.name}</strong>{" "}
        <span className="text-muted">({service.durationMinutes} min — {service.price ? `${service.price}€` : ""})</span>
      </h5>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Fecha y hora</label>
        <input
          type="datetime-local"
          className="form-control"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <small className="text-muted">Disponible jueves a domingo, 10:00–20:00</small>
      </div>

      <button className="btn btn-success" onClick={handleBooking} disabled={loading}>
        {loading ? "Reservando..." : "Confirmar reserva"}
      </button>
    </div>
  );
};

export default BookingForm;
