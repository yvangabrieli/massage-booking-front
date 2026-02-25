import { useEffect, useState } from "react";
import { getServices } from "../../services/serviceService";

const CATEGORY_LABELS = {
  DEEP_TISSUE: "Toque Profundo",
  RELAXING: "Relajación",
  SPECIALIZED: "Especializado",
};

const ServiceSelector = ({ onSelect, selectedId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mb-4 text-muted">Cargando servicios...</div>;

  return (
    <div className="mb-4">
      <h5 className="mb-3">Selecciona un tratamiento</h5>
      <div className="row g-3">
        {services.map((service) => (
          <div key={service.id} className="col-md-4">
            <div
              className={`card h-100 p-3 cursor-pointer ${selectedId === service.id ? "border-success border-2" : ""}`}
              style={{ cursor: "pointer", transition: "0.2s" }}
              onClick={() => onSelect(service)}
            >
              <div className="d-flex justify-content-between align-items-start mb-1">
                <strong>{service.name}</strong>
                {selectedId === service.id && <span className="badge bg-success">✓</span>}
              </div>
              <small className="text-muted">
                {CATEGORY_LABELS[service.category] || service.category}
              </small>
              <div className="mt-2">
                <span className="badge bg-light text-dark me-2">{service.durationMinutes} min</span>
                {service.price && <span className="fw-bold">{service.price}€</span>}
              </div>
              {service.description && (
                <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
                  {service.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
