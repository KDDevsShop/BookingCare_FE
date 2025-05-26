import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { Route, Routes } from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import PatientProfile from "./pages/patient/PatientProfile";
import CustomerLayout from "./layouts/CustomerLayout";
import EditPatientProfile from "./pages/patient/EditPatientProfile";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import AdminLayout from "./layouts/AdminLayout";
import DoctorListAdmin from "./pages/admin/DoctorListAdmin";
import SpecialtyList from "./pages/admin/SpecialtyList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route
          path="/me"
          element={
            <CustomerLayout>
              <PatientProfile />
            </CustomerLayout>
          }
        />
        <Route
          path="/me/edit"
          element={
            <CustomerLayout>
              {/* Edit profile page */}
              <EditPatientProfile />
            </CustomerLayout>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <AdminLayout>
              <DoctorListAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/specialties"
          element={
            <AdminLayout>
              <SpecialtyList />
            </AdminLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
