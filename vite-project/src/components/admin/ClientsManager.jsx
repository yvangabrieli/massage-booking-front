import { useEffect, useState } from "react";
import api from "../../services/api";

const ClientsManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadClients = (searchTerm = "") => {
    setLoading(true);
    const params = searchTerm ? { search: searchTerm } : {};
    api.get("/clients", { params })
      // ✅ FIX: handle both Page<ClientResponse> (.content) and plain List<ClientResponse>
      .then((res) => setClients(res.data.content || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadClients(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadClients(search);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Desactivar este cliente?")) return;
    api.delete(`/clients/${id}`).then(() => loadClients(search));
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Clientes</h4>
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <input className="form-control form-control-sm" placeholder="Buscar nombre o teléfono..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-outline-secondary btn-sm">Buscar</button>
        </form>
      </div>

      {loading && <div className="text-center py-3"><div className="spinner-border spinner-border-sm" /></div>}

      {!loading && clients.length === 0 && <div className="alert alert-info">No hay clientes.</div>}

      {clients.map((c) => (
        <div key={c.id} className="card p-3 mb-2 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{c.name}</strong>
              {!c.active && <span className="badge bg-secondary ms-2">Inactivo</span>}
              {c.phone && <div className="text-muted">{c.phone}</div>}
              {c.email && <small className="text-muted">{c.email}</small>}
              {c.notes && <div><small className="text-muted fst-italic">{c.notes}</small></div>}
            </div>
            {c.active && (
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(c.id)}>
                Desactivar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsManager;