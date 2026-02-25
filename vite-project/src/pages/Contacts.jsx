import { useState } from "react";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Messaggio inviato (simulazione)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-5">
      {/* Titolo */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Contactame</h2>
        <p className="text-muted">
          Sígueme en las redes sociales o envíame un mensaje directo
        </p>
      </div>

      {/* Social + Info */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-5 mb-4">
          <div className="p-4 border rounded shadow-sm h-100 text-center">
            <h5 className="mb-3">Sígueme</h5>
            <p className="mb-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>
            <p className="mb-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </p>
            <p className="mb-0">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          </div>
        </div>

        <div className="col-md-5 mb-4">
          <div className="p-4 border rounded shadow-sm h-100 text-center">
            <h5 className="mb-3">Información</h5>
            <p>Email: info@email.com</p>
            <p>Teléfono: +34 123 456 7890</p>
            <p className="mb-0"></p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow p-4">
            <h4 className="mb-4 text-center">Escríbeme un mensaje</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Messaggio</label>
                <textarea
                  name="message"
                  rows="4"
                  className="form-control"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Enviar mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
