import { useState } from "react";
import ClientsManager from "../components/admin/ClientsManager";
import BookingsManager from "../components/admin/BookingsManager";
import ServicesManager from "../components/admin/ServicesManager";
import { useAuth } from "../context/AuthContext";

const TABS = ["Bookings", "Clients", "Services"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Bookings");
  const isFullAdmin = user?.role === "ROLE_ADMIN";

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Administration Dashboard</h2>
        <span className="badge bg-dark">{user?.role}</span>
      </div>

      <ul className="nav nav-tabs mb-4">
        {TABS.map((tab) => (
          <li key={tab} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === "Bookings" && <BookingsManager />}
      {activeTab === "Clients" && <ClientsManager />}
      {activeTab === "Services" && <ServicesManager />}
    </div>
  );
};

export default AdminDashboard;