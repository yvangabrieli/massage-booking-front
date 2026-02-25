import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8,}$/;
const phoneRegex = /^\+?[0-9]{9,15}$/;

const Registration = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneRegex.test(formData.phone)) {
      return setError("Formato de teléfono inválido. Ej: +34612345678");
    }

    if (!passwordRegex.test(formData.password)) {
      return setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial"
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      login(user, token);
      navigate("/booking");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error durante el registro. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Crear cuenta</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" name="name" className="form-control"
                  value={formData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="text" name="phone" className="form-control"
                  value={formData.phone} onChange={handleChange}
                  placeholder="+34612345678" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control"
                  value={formData.email} onChange={handleChange}
                  placeholder="tu@email.com" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" name="password" className="form-control"
                  value={formData.password} onChange={handleChange}
                  placeholder="Mín. 8 caracteres, 1 mayúscula, 1 especial" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input type="password" name="confirmPassword" className="form-control"
                  value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              <div className="d-grid">
                <button className="btn btn-success" disabled={loading}>
                  {loading ? "Registrando..." : "Registrarse"}
                </button>
              </div>
            </form>

            <p className="text-center mt-3 mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
