import { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { getServices } from "../services/serviceService";
import MyBookings from "../components/booking/MyBookings";
import api from "../services/api";

// ── Mini calendar ──────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const WORKING = [4, 5, 6, 0]; // Thu=4 Fri=5 Sat=6 Sun=0

function isWorking(date) {
  return WORKING.includes(date.getDay());
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

const Calendar = ({ selectedDate, onSelect }) => {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prevMonth = () => {
    setView(v => {
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const nextMonth = () => {
    setView(v => {
      const d = new Date(v.year, v.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.year, view.month, d));

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <button onClick={prevMonth} style={navBtnStyle}>‹</button>
        <span style={{ fontWeight: 700, color: "var(--brown-dark)", fontSize: "1rem" }}>
          {MONTHS[view.month]} {view.year}
        </span>
        <button onClick={nextMonth} style={navBtnStyle}>›</button>
      </div>
      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 600, color: "#aaa", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      {/* Cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isFuture = date > maxDate;
          const isAvail = isWorking(date) && !isPast && !isFuture;
          const isSelected = selectedDate && sameDay(date, selectedDate);
          const isToday = sameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => isAvail && onSelect(date)}
              style={{
                padding: "7px 2px",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: isSelected || isToday ? 700 : 400,
                cursor: isAvail ? "pointer" : "default",
                background: isSelected ? "var(--brown)" : isToday ? "var(--cream)" : "transparent",
                color: isSelected ? "white" : isPast || isFuture || !isWorking(date) ? "#ccc" : "var(--brown-dark)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => isAvail && !isSelected && (e.currentTarget.style.background = "var(--cream)")}
              onMouseLeave={e => isAvail && !isSelected && (e.currentTarget.style.background = "transparent")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#aaa", textAlign: "center" }}>
        Available: Thursday – Sunday
      </div>
    </div>
  );
};

const navBtnStyle = {
  background: "none", border: "none", fontSize: "1.4rem",
  cursor: "pointer", color: "var(--brown)", padding: "0 8px",
  lineHeight: 1,
};

// ── Time slot picker ───────────────────────────────────────────────
const TimeSlotPicker = ({ date, selectedTime, onSelect }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    const pad = n => String(n).padStart(2, "0");
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    api.get(`/availability/slots?date=${dateStr}`)
      .then(res => setSlots(res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date]);

  if (!date) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: "#bbb", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ fontSize: "2.5rem" }}>📅</div>
      <div>Select a date to see available times</div>
    </div>
  );

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div className="spinner-border spinner-border-sm" style={{ color: "var(--brown)" }} />
    </div>
  );

  if (slots.length === 0) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "160px", color: "#aaa", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ fontSize: "2rem" }}>😔</div>
      <div>No slots available for this day</div>
    </div>
  );

  return (
    <div>
      <div style={{ fontWeight: 600, color: "var(--brown-dark)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
        Available times — {date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
        {slots.map(slot => {
          const time = typeof slot === "string" ? slot.slice(11, 16) : new Date(slot).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
          const isSelected = selectedTime === time;
          return (
            <button
              key={slot}
              onClick={() => onSelect(time)}
              style={{
                padding: "10px 6px", border: `2px solid ${isSelected ? "var(--brown)" : "#e8e0d5"}`,
                borderRadius: "10px", background: isSelected ? "var(--brown)" : "white",
                color: isSelected ? "white" : "var(--brown-dark)",
                fontWeight: isSelected ? 700 : 400, fontSize: "0.9rem",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = "var(--brown)")}
              onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = "#e8e0d5")}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Click ripple effect ────────────────────────────────────────────
function rippleEffect(e) {
  const btn = e.currentTarget;
  const circle = document.createElement("span");
  const rect = btn.getBoundingClientRect();
  circle.style.cssText = `
    position:absolute;left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;
    width:0;height:0;border-radius:50%;background:rgba(255,255,255,0.4);
    transform:translate(-50%,-50%);animation:ripple 0.5s linear;pointer-events:none;
  `;
  btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

// Inject ripple keyframes once
if (!document.getElementById("ripple-style")) {
  const s = document.createElement("style");
  s.id = "ripple-style";
  s.textContent = `@keyframes ripple{to{width:200px;height:200px;opacity:0}}`;
  document.head.appendChild(s);
}

// ── Main BookingPage ───────────────────────────────────────────────
const BookingPage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getServices().then(res => setServices(res.data || []));
  }, []);

  const handleBook = async (e) => {
    rippleEffect(e);
    if (!selectedService) return setError("Please select a service");
    if (!selectedDate) return setError("Please select a date");
    if (!selectedTime) return setError("Please select a time");

    const pad = n => String(n).padStart(2, "0");
    const startTime = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth()+1)}-${pad(selectedDate.getDate())}T${selectedTime}:00`;

    setLoading(true);
    setError("");
    try {
      await createBooking({ serviceId: selectedService.id, startTime });
      setSuccess(`✅ Booking confirmed! ${selectedService.name} on ${selectedDate.toLocaleDateString("en-GB")} at ${selectedTime}`);
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setRefreshKey(k => k + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = { DEEP_TISSUE: "Deep Tissue", RELAXING: "Relaxation", SPECIALIZED: "Specialised" };

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h2 style={{ fontWeight: 700, color: "var(--brown-dark)" }}>Book Your Session</h2>
        <p style={{ color: "#888" }}>Available Thursday – Sunday, 10:00 – 20:00</p>
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible mb-4" style={{ borderRadius: "12px" }}>
          {success}
          <button className="btn-close" onClick={() => setSuccess("")} />
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible mb-4" style={{ borderRadius: "12px" }}>
          {error}
          <button className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      {/* Step 1 — Service */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h5 style={{ fontWeight: 700, color: "var(--brown-dark)", marginBottom: "1rem" }}>
          <span style={{ background: "var(--brown)", color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", marginRight: "10px" }}>1</span>
          Choose a treatment
        </h5>
        <div className="row g-3">
          {services.map(s => (
            <div key={s.id} className="col-md-4 col-sm-6">
              <div
                onClick={() => setSelectedService(s)}
                style={{
                  padding: "1.25rem", borderRadius: "14px", cursor: "pointer",
                  border: `2px solid ${selectedService?.id === s.id ? "var(--brown)" : "#e8e0d5"}`,
                  background: selectedService?.id === s.id ? "rgba(165,88,1,0.06)" : "white",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (selectedService?.id !== s.id) e.currentTarget.style.borderColor = "var(--brown-light)"; }}
                onMouseLeave={e => { if (selectedService?.id !== s.id) e.currentTarget.style.borderColor = "#e8e0d5"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <strong style={{ color: "var(--brown-dark)", fontSize: "0.95rem" }}>{s.name}</strong>
                  {selectedService?.id === s.id && <span style={{ color: "var(--brown)", fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#aaa", margin: "4px 0" }}>{CATEGORIES[s.category] || s.category}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                  <span style={{ background: "var(--cream)", borderRadius: "20px", padding: "2px 10px", fontSize: "0.8rem", color: "var(--brown-dark)" }}>{s.durationMinutes} min</span>
                  {s.price && <span style={{ fontWeight: 700, color: "var(--brown)" }}>{s.price}€</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2 — Calendar + Time slots side by side */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h5 style={{ fontWeight: 700, color: "var(--brown-dark)", marginBottom: "1rem" }}>
          <span style={{ background: "var(--brown)", color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", marginRight: "10px" }}>2</span>
          Pick a date & time
        </h5>
        <div className="row g-4">
          {/* Calendar on the LEFT */}
          <div className="col-md-5">
            <Calendar selectedDate={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }} />
          </div>
          {/* Time slots on the RIGHT */}
          <div className="col-md-7">
            <div style={{ background: "white", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", minHeight: "220px" }}>
              <TimeSlotPicker date={selectedDate} selectedTime={selectedTime} onSelect={setSelectedTime} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary + Confirm */}
      {selectedService && selectedDate && selectedTime && (
        <div style={{ background: "var(--cream)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--brown-dark)", marginBottom: "0.25rem" }}>{selectedService.name}</div>
            <div style={{ color: "#666" }}>
              {selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {selectedTime}
              {selectedService.price && <span style={{ marginLeft: "12px", fontWeight: 700, color: "var(--brown)" }}>{selectedService.price}€</span>}
            </div>
          </div>
          <button
            onClick={handleBook}
            disabled={loading}
            style={{
              background: "var(--brown)", color: "white", border: "none",
              padding: "14px 36px", borderRadius: "30px", fontWeight: 700,
              fontSize: "1rem", cursor: "pointer", transition: "background 0.2s, transform 0.1s",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--brown-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--brown)"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {loading ? "Confirming..." : "Confirm Booking ✓"}
          </button>
        </div>
      )}

      <hr style={{ margin: "2.5rem 0", borderColor: "#e8e0d5" }} />

      <h4 style={{ fontWeight: 700, color: "var(--brown-dark)", marginBottom: "1.5rem" }}>My Bookings</h4>
      <MyBookings key={refreshKey} />
    </div>
  );
};

export default BookingPage;
