import './App.css';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { Route, Routes } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import PatientProfile from './pages/patient/PatientProfile';
import CustomerLayout from './layouts/CustomerLayout';
import EditPatientProfile from './pages/patient/EditPatientProfile';
import ForgotPassword from './pages/authentication/ForgotPassword';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorListAdmin from './pages/admin/DoctorListAdmin';
import SpecialtyList from './pages/admin/SpecialtyList';
import DoctorProfile from './pages/doctor/DoctorProfile';
import EditDoctorProfile from './pages/doctor/EditDoctorProfile';
import DoctorList from './pages/doctor/DoctorList';
import DoctorDetail from './pages/doctor/DoctorDetail';
import BookingPage from './pages/booking/BookingPage';
import BookingDetailPage from './pages/booking/BookingDetailPage';
import PatientBookingsPage from './pages/booking/PatientBookingsPage';
import Dashboard from './pages/admin/Dashboard';
import SpecialtyListPatient from './pages/specialty/SpecialtyListPatient';
import SpecialtyDetail from './pages/specialty/SpecialtyDetail';
import FAQListAdmin from './pages/admin/FAQListAdmin';
import FAQListPatient from './pages/patient/FAQListPatient';
import DoctorBookingsPage from './pages/booking/DoctorBookingsPage';
import BookingDetailDoctor from './pages/booking/BookingDetailDoctor';
import BookingHistoryPatient from './pages/booking/BookingHistoryPatient';
import BookingConfirmPage from './pages/booking/BookingConfirmPage';
import PatientListAdmin from './pages/admin/PatientListAdmin';
import AdminBookingsPage from './pages/booking/AdminBookingsPage';

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

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
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
        <Route
          path="/admin/faqs"
          element={
            <AdminLayout>
              <FAQListAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <AdminLayout>
              <PatientListAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminLayout>
              <AdminBookingsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/booking/:id"
          element={
            <AdminLayout>
              <BookingDetailDoctor />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/patients/:id/bookings"
          element={
            <AdminLayout>
              <BookingHistoryPatient />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/booking-history/:id"
          element={
            <AdminLayout>
              <BookingDetailPage />
            </AdminLayout>
          }
        />

        {/* Doctor Routes */}

        <Route
          path="/doctor/profile"
          element={
            <DoctorLayout>
              <DoctorProfile />
            </DoctorLayout>
          }
        />
        <Route
          path="/doctor/profile/edit"
          element={
            <DoctorLayout>
              {/* Edit profile page */}
              <EditDoctorProfile />
            </DoctorLayout>
          }
        />

        <Route
          path="/doctors"
          element={
            <CustomerLayout>
              <DoctorList />
            </CustomerLayout>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <CustomerLayout>
              <DoctorDetail />
            </CustomerLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <CustomerLayout>
              <BookingPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <CustomerLayout>
              <BookingDetailPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <CustomerLayout>
              <PatientBookingsPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/specialties"
          element={
            <CustomerLayout>
              <SpecialtyListPatient />
            </CustomerLayout>
          }
        />
        <Route
          path="/specialties/:id"
          element={
            <CustomerLayout>
              <SpecialtyDetail />
            </CustomerLayout>
          }
        />
        <Route
          path="/faqs"
          element={
            <CustomerLayout>
              <FAQListPatient />
            </CustomerLayout>
          }
        />
        <Route
          path="/doctor/bookings"
          element={
            <DoctorLayout>
              <DoctorBookingsPage />
            </DoctorLayout>
          }
        />
        <Route
          path="/doctor/booking/:id"
          element={
            <DoctorLayout>
              <BookingDetailDoctor />
            </DoctorLayout>
          }
        />
        <Route
          path="/patients/:id/bookings"
          element={
            <DoctorLayout>
              <BookingHistoryPatient />
            </DoctorLayout>
          }
        />

        <Route
          path="/doctor/booking-history/:id"
          element={
            <DoctorLayout>
              <BookingDetailPage />
            </DoctorLayout>
          }
        />
        <Route
          path="/booking/confirm"
          element={
            <CustomerLayout>
              <BookingConfirmPage />
            </CustomerLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
