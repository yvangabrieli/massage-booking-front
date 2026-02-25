import { useEffect, useState } from "react";
import { getServices, createService, deleteService } from "../../services/serviceService";

const CATEGORIES = ["DEEP_TISSUE", "RELAXING", "SPECIALIZED"];
const CATEGORY_LABELS = { DEEP_TISSUE: "Toque Profundo", RELAXING: "Relajación", SPECIALIZED: "Especializado" };

const emptyForm = { name: "", category: "RELAXING", durationMinutes: 60, cleanupMinutes: 10, price: "", description: "" };

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const loadServices = () => {
    getServices().then((res) => setServices(res.data || []));
  };

  useEffect(() => { loadServices(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    deleteService(id).then(loadServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createService({
        ...form,
        durationMinutes: Number(form.durationMinutes),
        cleanupMinutes: Number(form.cleanupMinutes),
        price: Number(form.price),
      });
      setShowForm(false);
      setForm(emptyForm);
      loadServices();
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Servicios</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar" : "+ Nuevo servicio"}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-4 border-primary">
          <h5 className="mb-3">Nuevo servicio</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Duración (min)</label>
                <input type="number" className="form-control" value={form.durationMinutes} required min="15"
                  onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Limpieza (min)</label>
                <input type="number" className="form-control" value={form.cleanupMinutes} min="0"
                  onChange={(e) => setForm({ ...form, cleanupMinutes: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Precio (€)</label>
                <input type="number" className="form-control" value={form.price} required min="0" step="0.5"
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea className="form-control" rows="2" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Guardando..." : "Guardar servicio"}
              </button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="row g-3">
        {services.map((s) => (
          <div key={s.id} className="col-md-4">
            <div className="card h-100 p-3">
              <div className="d-flex justify-content-between">
                <strong>{s.name}</strong>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(s.id)}>✕</button>
              </div>
              <small className="text-muted">{CATEGORY_LABELS[s.category] || s.category}</small>
              {/* FIX: was using s.duration (undefined) — correct field is s.durationMinutes */}
              <div className="mt-2">{s.durationMinutes} min — {s.price}€</div>
              {s.description && <p className="text-muted mt-1 mb-0" style={{ fontSize: "0.83rem" }}>{s.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
