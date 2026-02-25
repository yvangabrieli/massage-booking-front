import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import BookingPage from "./pages/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Registration from "./pages/Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />

          {/* Admin protected */}
          <Route
            path="admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Booking accessible to all, login checked inside BookingPage */}
          <Route
            path="booking"
            element={<BookingPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
