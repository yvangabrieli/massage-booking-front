import { useState } from "react";
import { createBooking } from "../services/bookingService";
import ServiceSelector from "../components/booking/ServiceSelector";
import BookingForm from "../components/booking/BookingForm";
import MyBookings from "../components/booking/MyBookings";

const BookingPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBooking = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // FIX: createBooking takes only data (no clientId param — JWT handles it)
      await createBooking(data);
      setSuccess("¡Reserva confirmada! Recibirás un email de confirmación.");
      setSelectedService(null);
      setRefreshKey((k) => k + 1); // trigger MyBookings reload
    } catch (err) {
      const msg = err.response?.data?.message || "Error al crear la reserva";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Reserva tu cita</h2>

      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
          <button className="btn-close" onClick={() => setSuccess("")} />
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button className="btn-close" onClick={() => setError("")} />
        </div>
      )}

      <ServiceSelector
        onSelect={setSelectedService}
        selectedId={selectedService?.id}
      />

      <BookingForm
        service={selectedService}
        onSubmit={handleBooking}
        loading={loading}
      />

      <hr className="my-4" />

      <MyBookings key={refreshKey} />
    </div>
  );
};

export default BookingPage;
