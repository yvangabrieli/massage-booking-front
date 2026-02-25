import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };
  const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUBADMIN";

  return (
    <header className="topbar">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <Link to="/"><img className="logo" src="/logo.png" alt="Tokame" /></Link>
          </div>
          <div className="col-6 text-end">
            <nav className="navLinks">
              <Link to="/">Home</Link>
              <Link to="/contacts">Contact</Link>
              {!user ? (
                <>
                  <Link to="/registration">Sign Up</Link>
                  <Link to="/login">Login</Link>
                </>
              ) : (
                <>
                  {isAdmin ? <Link to="/admin">Admin Panel</Link> : <Link to="/booking">My Bookings</Link>}
                  <span style={{ color: "var(--cream)", fontWeight: 600 }}>{user.name}</span>
                  <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#ffe082", fontWeight: 600, cursor: "pointer", padding: 0 }}>
                    Log out
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
