import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBookNow = () => {
    navigate("/booking"); // navigate to booking page
  };

  const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUBADMIN";

  return (
    <header className="topbar-minimal">
      {/* Left side: logo */}
      <div className="logo-left">
        <Link to="/">
          <img src="/images/logo.png" alt="Tokame" /> {/* xxxxx replace with your logo */}
        </Link>
      </div>

      {/* Right side: user links */}
      <nav className="nav-right">
        <Link to="/" className="btn-outline-small">Home</Link>  {/* <-- Home link */}
        <button onClick={handleBookNow} className="btn-primary-small">
          Book Now
        </button>

        {!user ? (
          <>
            <Link to="/registration" className="btn-outline-small">Sign Up</Link>
            <Link to="/login" className="btn-primary-small">Login</Link>
          </>
        ) : (
          <>
            {isAdmin
              ? <Link to="/admin" className="btn-outline-small">Admin Panel</Link>
              : <Link to="/booking" className="btn-outline-small">My Bookings</Link>
            }
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Log out</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;