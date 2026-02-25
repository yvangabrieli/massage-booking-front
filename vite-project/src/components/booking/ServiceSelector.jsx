import { useEffect, useState } from "react";
import { getServices } from "../../services/serviceService";
import PropTypes from "prop-types";

const CATEGORY_LABELS = {
  DEEP_TISSUE: "Deep Tissue",
  RELAXING: "Relaxation",
  SPECIALIZED: "Specialized",
};

const ServiceCard = ({ service, isSelected, onSelect }) => (
  <div
    className={`col-md-4 ${isSelected ? "selected-service" : ""}`}
    onClick={() => onSelect(service)}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === "Enter" && onSelect(service)}
  >
    <div className="service-card">
      <div className="service-header">
        <h6 className="service-name">{service.name}</h6>
        {isSelected && <span className="check-badge">✓</span>}
      </div>
      <span className="category-label">
        {CATEGORY_LABELS[service.category] || service.category}
      </span>
      <div className="service-meta">
        <span className="duration-badge">{service.durationMinutes} min</span>
        {service.price && <span className="price-tag">{service.price}€</span>}
      </div>
      {service.description && (
        <p className="service-description">{service.description}</p>
      )}
    </div>
  </div>
);

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    durationMinutes: PropTypes.number.isRequired,
    price: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const ServiceSelector = ({ onSelect, selectedId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data || []);
      } catch (err) {
        setError("Failed to load services. Please try again.");
        console.error("Service fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Loading services...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="service-selector">
      <h4 className="section-title">Select Your Treatment</h4>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedId === service.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
};

ServiceSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
};

ServiceSelector.defaultProps = {
  selectedId: null,
};

export default ServiceSelector;