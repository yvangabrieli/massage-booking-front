import { useEffect, useState } from "react";
import api from "../../services/api";
import { updateBookingStatus } from "../../services/bookingService";

const STATUS_LABELS = {
  BOOKED: { label: "Reservado", color: "success" },
  COMPLETED: { label: "Completado", color: "secondary" },
  CANCELED: { label: "Cancelado", color: "danger" },
  NO_SHOW: { label: "No presentado", color: "warning" },
};

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const loadBookings = () => {
    setLoading(true);
    const params = filterStatus ? { status: filterStatus } : {};
    api.get("/bookings", { params })
      .then((res) => setBookings(res.data.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, [filterStatus]);

  const handleCancel = (id) => {
    const reason = prompt("Motivo de cancelación:");
    if (!reason) return;
    // FIX: reason as query param
    api.delete(`/bookings/${id}`, { params: { reason } }).then(loadBookings);
  };

  const handleStatus = (id, status) => {
    // FIX: PATCH /bookings/{id}/status?status=... with null body
    updateBookingStatus(id, status).then(loadBookings);
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Reservas</h4>
        <select className="form-select w-auto" value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todas</option>
          <option value="BOOKED">Reservadas</option>
          <option value="COMPLETED">Completadas</option>
          <option value="CANCELED">Canceladas</option>
          <option value="NO_SHOW">No presentados</option>
        </select>
      </div>

      {loading && <div className="text-center py-3"><div className="spinner-border spinner-border-sm" /></div>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info">No hay reservas.</div>
      )}

      {bookings.map((b) => {
        const statusInfo = STATUS_LABELS[b.status] || { label: b.status, color: "secondary" };
        return (
          <div key={b.id} className="card p-3 mb-2 shadow-sm">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{b.client?.name || b.guestName || "Cliente"}</strong>
                <span className={`badge bg-${statusInfo.color} ms-2`}>{statusInfo.label}</span>
                <div className="text-muted">
                  {b.service?.name} —{" "}
                  {new Date(b.startTime).toLocaleString("es-ES", {
                    weekday: "short", day: "2-digit", month: "short",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </div>
                {b.client?.phone && <small className="text-muted">{b.client.phone}</small>}
              </div>

              {b.status === "BOOKED" && (
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleStatus(b.id, "COMPLETED")}>
                    ✓ Completado
                  </button>
                  <button className="btn btn-sm btn-outline-warning"
                    onClick={() => handleStatus(b.id, "NO_SHOW")}>
                    No vino
                  </button>
                  <button className="btn btn-sm btn-outline-danger"
                    onClick={() => handleCancel(b.id)}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingsManager;
