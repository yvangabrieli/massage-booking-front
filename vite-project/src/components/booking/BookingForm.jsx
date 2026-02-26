import { useState } from "react";
import PropTypes from "prop-types";

const MIN_ADVANCE_HOURS = 2;
const MAX_ADVANCE_DAYS = 90;

const BookingForm = ({ service, onSubmit, loading }) => {
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");

  if (!service) return null;

  const validateBooking = (startDate) => {
    const now = new Date();
    const diffHours = (startDate - now) / (1000 * 60 * 60);

    if (diffHours < MIN_ADVANCE_HOURS) {
      return "Please book at least 2 hours in advance";
    }
    if (diffHours > 24 * MAX_ADVANCE_DAYS) {
      return "Cannot book more than 3 months ahead";
    }
    return null;
  };

  const handleSubmit = () => {
    setError("");

    const startDate = new Date(dateTime);
    if (isNaN(startDate.getTime())) {
      setError("Please select a valid date and time");
      return;
    }

    const validationError = validateBooking(startDate);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit({
      serviceId: service.id,
      startTime: startDate.toISOString().slice(0, 19),
    });

    setDateTime("");
  };

  const formatServiceDetails = () => {
    const duration = `${service.durationMinutes} min`;
    const price = service.price ? ` — ${service.price}€` : "";
    return `${duration}${price}`;
  };

  return (
    <article className="booking-form-container">
      {/*
        PASTE YOUR LOCAL IMAGE PATH HERE:
        Example: src="/assets/images/massage-therapy.jpg"
        Or: src={require("../../assets/massage.jpg")}
      */}
      <img
        src="/path/to/your/local/image.jpg"
        alt="Massage therapy session"
        className="booking-image"
      />

      <div className="booking-form-card">
        <header className="form-header">
          <h4>Book Your Session</h4>
          <div className="service-summary">
            <strong>{service.name}</strong>
            <span className="text-muted">{formatServiceDetails()}</span>
          </div>
        </header>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="datetime" className="form-label">
            Date & Time
          </label>
          <input
            id="datetime"
            type="datetime-local"
            className="form-control"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            disabled={loading}
          />
          <small className="form-hint">
            Available Thursday–Sunday, 10:00–20:00
          </small>
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={handleSubmit}
          disabled={loading || !dateTime}
          type="button"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </article>
  );
};

BookingForm.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    durationMinutes: PropTypes.number.isRequired,
    price: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

BookingForm.defaultProps = {
  service: null,
  loading: false,
};

export default BookingForm;