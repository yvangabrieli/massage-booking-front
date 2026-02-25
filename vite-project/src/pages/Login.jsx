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
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      login(user, token);
      if (user.role === "ROLE_ADMIN" || user.role === "ROLE_SUBADMIN") navigate("/admin");
      else navigate("/booking");
    } catch (err) {
      setError(err.response?.status === 401 ? "Incorrect email or password" : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4" style={{ color: "var(--brown-dark)", fontWeight: 700 }}>Welcome Back</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" />
              </div>
              <div className="d-grid">
                <button className="btn btn-primary" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
              </div>
            </form>
            <p className="text-center mt-3 mb-0">Don't have an account? <Link to="/registration">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
