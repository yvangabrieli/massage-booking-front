import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // FIX: ROLE_SUBADMIN should also access the admin panel
  if (role === "ADMIN" && user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUBADMIN") {
    return <Navigate to="/" />;
  }

  if (role === "CLIENT" && user.role === "ROLE_ADMIN") {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
