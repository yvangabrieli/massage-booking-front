import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../../services/bookingService";

const STATUS_LABELS = {
  BOOKED: { label: "Reservado", color: "success" },
  COMPLETED: { label: "Completado", color: "secondary" },
  CANCELED: { label: "Cancelado", color: "danger" },
  NO_SHOW: { label: "No presentado", color: "warning" },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    setLoading(true);
    // FIX: GET /bookings — no clientId param needed, JWT handles it
    getMyBookings()
      .then((res) => setBookings(res.data.content || []))
      .catch(() => setError("Error cargando reservas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = (booking) => {
    // FIX: check canCancel field from API instead of recalculating client-side
    if (!booking.canCancel) {
      return setError("No puedes cancelar con menos de 12 horas de antelación");
    }
    if (!window.confirm("¿Cancelar esta reserva?")) return;

    // FIX: reason as query param (not body)
    cancelBooking(booking.id, "Cancelado por el cliente")
      .then(loadBookings)
      .catch(() => setError("Error al cancelar la reserva"));
  };

  if (loading) return <div className="text-center py-3"><div className="spinner-border spinner-border-sm" /></div>;

  return (
    <div className="mt-4">
      <h4 className="mb-3">Mis reservas</h4>

      {error && <div className="alert alert-danger alert-dismissible">
        {error}
        <button className="btn-close" onClick={() => setError("")} />
      </div>}

      {bookings.length === 0 && (
        <div className="alert alert-info">No tienes reservas todavía.</div>
      )}

      {bookings.map((b) => {
        const statusInfo = STATUS_LABELS[b.status] || { label: b.status, color: "secondary" };
        return (
          <div key={b.id} className="card p-3 mb-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                {/* FIX: show service name + status badge */}
                <strong>{b.service?.name || "Servicio"}</strong>
                <span className={`badge bg-${statusInfo.color} ms-2`}>{statusInfo.label}</span>
                <div className="text-muted mt-1">
                  {new Date(b.startTime).toLocaleString("es-ES", {
                    weekday: "short", day: "2-digit", month: "short",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </div>
                {b.service?.durationMinutes && (
                  <small className="text-muted">{b.service.durationMinutes} min</small>
                )}
                {b.canceledReason && (
                  <div className="text-danger mt-1"><small>Motivo: {b.canceledReason}</small></div>
                )}
              </div>
              {b.status === "BOOKED" && b.canCancel && (
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleCancel(b)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
