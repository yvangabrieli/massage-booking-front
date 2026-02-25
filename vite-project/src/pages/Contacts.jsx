 import { useState } from "react";

const Contacts = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 style={{ fontWeight: 700, color: "var(--brown-dark)" }}>Get in Touch</h2>
        <p className="text-muted">Follow me on social media or send me a direct message</p>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-5 mb-4">
          <div className="p-4 border rounded shadow-sm h-100 text-center">
            <h5 className="mb-3">Follow Me</h5>
            <p className="mb-2"><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></p>
            <p className="mb-2"><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></p>
            <p className="mb-0"><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></p>
          </div>
        </div>
        <div className="col-md-5 mb-4">
          <div className="p-4 border rounded shadow-sm h-100 text-center">
            <h5 className="mb-3">Contact Info</h5>
            <p>Email: info@tokame.com</p>
            <p>Phone: +34 123 456 7890</p>
            <p className="mb-0">Thursday – Sunday, 10:00–20:00</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow p-4">
            <h4 className="mb-4 text-center">Send a Message</h4>
            {sent && <div className="alert alert-success">Message sent! I'll get back to you soon.</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea name="message" rows="4" className="form-control" value={formData.message} onChange={handleChange} required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
