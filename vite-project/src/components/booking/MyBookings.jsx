import { useEffect, useState, useCallback } from "react";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import PropTypes from "prop-types";

const STATUS_CONFIG = {
  BOOKED: { label: "Upcoming", className: "status-upcoming" },
  COMPLETED: { label: "Completed", className: "status-completed" },
  CANCELED: { label: "Cancelled", className: "status-cancelled" },
  NO_SHOW: { label: "No Show", className: "status-no-show" },
};

const BookingCard = ({ booking, onCancel }) => {
  const status = STATUS_CONFIG[booking.status] || {
    label: booking.status,
    className: "status-default",
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(booking.startTime);

  return (
    <div className="booking-card">
      <div className="booking-info">
        <div className="booking-header">
          <h6 className="service-name">{booking.service?.name || "Session"}</h6>
          <span className={`status-badge ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="booking-datetime">
          <span className="date">{date}</span>
          <span className="separator">·</span>
          <span className="time">{time}</span>
        </div>
        {booking.service?.durationMinutes && (
          <span className="duration">{booking.service.durationMinutes} min</span>
        )}
        {booking.canceledReason && (
          <p className="cancel-reason">Reason: {booking.canceledReason}</p>
        )}
      </div>
      {booking.status === "BOOKED" && booking.canCancel && (
        <button
          className="cancel-btn"
          onClick={() => onCancel(booking)}
          type="button"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    canCancel: PropTypes.bool,
    canceledReason: PropTypes.string,
    service: PropTypes.shape({
      name: PropTypes.string,
      durationMinutes: PropTypes.number,
    }),
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};

const EmptyState = () => (
  <div className="empty-state">
    <span className="empty-icon">📋</span>
    <p>No bookings yet — book your first session above!</p>
  </div>
);

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyBookings();
      setBookings(response.data.content || []);
    } catch {
      setError("Could not load bookings. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = useCallback(
    async (booking) => {
      if (!booking.canCancel) {
        setError("Cannot cancel within 12 hours of appointment");
        return;
      }

      if (!window.confirm("Are you sure you want to cancel this booking?")) {
        return;
      }

      try {
        await cancelBooking(booking.id, "Cancelled by client");
        await loadBookings();
      } catch {
        setError("Could not cancel booking. Please try again.");
      }
    },
    [loadBookings]
  );

  const dismissError = () => setError(null);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState />;
  }

  return (
    <section
      className="my-bookings"
      style={{
        backgroundImage: "url(/images/afropattern.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay to ensure text readability over the pattern */}
      <div className="bookings-overlay">
        {error && (
          <div className="alert alert-error">
            {error}
            <button className="close-btn" onClick={dismissError} type="button">
              ×
            </button>
          </div>
        )}

        <div className="bookings-grid">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBookings;