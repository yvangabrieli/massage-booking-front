import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUBADMIN";

  return (
    <header className="topbar">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <Link to="/">
              <img className="logo" src="/logo.png" alt="logo" />
            </Link>
          </div>

          <div className="col-6 text-end">
            <nav className="navLinks">
              <Link to="/">Home</Link>
              <Link to="/contacts">Contacto</Link>

              {!user ? (
                <>
                  <Link to="/registration">Regístrate</Link>
                  <Link to="/login">Login</Link>
                </>
              ) : (
                <>
                  {isAdmin ? (
                    <Link to="/admin">Panel Admin</Link>
                  ) : (
                    <Link to="/booking">Mis reservas</Link>
                  )}
                  <span className="fw-bold text-white">{user.name}</span>
                  <button onClick={handleLogout} className="btn fw-bold text-warning p-0 ms-2">
                    Salir
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
