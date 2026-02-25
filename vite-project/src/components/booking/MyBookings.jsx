import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../../services/bookingService";

const STATUS = {
  BOOKED: { label: "Upcoming", color: "#2e7d32", bg: "#e8f5e9" },
  COMPLETED: { label: "Completed", color: "#555", bg: "#f0f0f0" },
  CANCELED: { label: "Cancelled", color: "#c62828", bg: "#ffebee" },
  NO_SHOW: { label: "No Show", color: "#e65100", bg: "#fff3e0" },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then(res => setBookings(res.data.content || []))
      .catch(() => setError("Could not load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = (b) => {
    if (!b.canCancel) return setError("Cannot cancel within 12 hours of appointment");
    if (!window.confirm("Cancel this booking?")) return;
    cancelBooking(b.id, "Cancelled by client").then(load).catch(() => setError("Could not cancel booking"));
  };

  if (loading) return <div className="text-center py-3"><div className="spinner-border spinner-border-sm" style={{ color: "var(--brown)" }} /></div>;

  if (bookings.length === 0) return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📋</div>
      <div>No bookings yet — book your first session above!</div>
    </div>
  );

  return (
    <div>
      {error && <div className="alert alert-danger alert-dismissible mb-3">
        {error}<button className="btn-close" onClick={() => setError("")} />
      </div>}
      <div className="row g-3">
        {bookings.map(b => {
          const s = STATUS[b.status] || { label: b.status, color: "#555", bg: "#f0f0f0" };
          return (
            <div key={b.id} className="col-md-6">
              <div style={{ background: "white", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <strong style={{ color: "var(--brown-dark)" }}>{b.service?.name || "Session"}</strong>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, padding: "2px 10px", borderRadius: "20px" }}>{s.label}</span>
                  </div>
                  <div style={{ color: "#666", fontSize: "0.9rem" }}>
                    {new Date(b.startTime).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                    {" · "}
                    {new Date(b.startTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {b.service?.durationMinutes && (
                    <div style={{ color: "#aaa", fontSize: "0.82rem", marginTop: "2px" }}>{b.service.durationMinutes} min</div>
                  )}
                  {b.canceledReason && (
                    <div style={{ color: "#e57373", fontSize: "0.82rem", marginTop: "4px" }}>Reason: {b.canceledReason}</div>
                  )}
                </div>
                {b.status === "BOOKED" && b.canCancel && (
                  <button onClick={() => handleCancel(b)}
                    style={{ background: "none", border: "1px solid #ffcdd2", color: "#e57373", borderRadius: "8px", padding: "6px 12px", fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap", transition: "0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#ffebee"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
