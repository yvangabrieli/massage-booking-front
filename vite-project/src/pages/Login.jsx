import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FIX: API expects { email, password } — NOT { phone, password }
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      login(user, token);

      if (user.role === "ROLE_ADMIN" || user.role === "ROLE_SUBADMIN") {
        navigate("/admin");
      } else {
        navigate("/booking");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email o contraseña incorrectos");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Iniciar Sesión</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="d-grid">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </form>

            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta?{" "}
              <Link to="/registration">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
