import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from '../../services/booking.service';
import PrescriptionForm from '../prescription/PrescriptionForm';
import PrescriptionDetail from '../prescription/PrescriptionDetail';
import PrescriptionService from '../../services/prescription.service';
import { toast } from 'react-toastify';

function BookingDetailDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const role = JSON.parse(localStorage.getItem('account'))?.role || '';
  console.log(role);

  useEffect(() => {
    async function fetchBooking() {
      setLoading(true);
      try {
        const res = await BookingService.getBookingById(id);
        setPrescription(res.prescription);
        setBooking(res);
      } catch (err) {
        setError('Không thể tải chi tiết đặt lịch.');
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  console.log(prescription);

  async function handleCancelBooking() {
    setCancelLoading(true);
    setCancelError(null);
    setCancelSuccess(null);
    try {
      const res = await BookingService.cancelBooking(id);
      const msg = res?.message;
      if (msg === 'Bạn chỉ có thể hủy lịch trước giờ hẹn ít nhất 1 tiếng.') {
        toast.error(msg);
      } else {
        toast.success('Đã hủy lịch thành công.');
        setBooking({ ...booking, bookingStatus: 'Đã hủy' });
      }
    } catch (error) {
      setCancelError(
        error?.response?.data?.message ||
          'Không thể hủy lịch khám. Vui lòng thử lại.'
      );
    } finally {
      setCancelLoading(false);
    }
  }

  async function fetchPrescription() {
    setPrescriptionLoading(true);
    setPrescriptionError(null);
    try {
      const res = await BookingService.getBookingById(id);
      setPrescription(res.prescription);
      setBooking(res); // Keep the booking up-to-date too!
    } catch (err) {
      setPrescriptionError('Không thể tải đơn thuốc.');
    } finally {
      setPrescriptionLoading(false);
    }
  }

  async function handlePrescriptionSubmit(imageBlob) {
    setPrescriptionLoading(true);
    setPrescriptionError(null);
    try {
      const formData = {
        bookingId: booking.id,
      };
      await PrescriptionService.createPrescription(formData, imageBlob);

      setShowPrescriptionForm(false);
      toast.success('Đã tạo đơn thuốc thành công!');

      // Fetch the updated prescription detail
      await fetchPrescription();
    } catch (error) {
      console.error(error);
      setPrescriptionError('Không thể tạo đơn thuốc.');
    } finally {
      setPrescriptionLoading(false);
    }
  }

  async function handleSendEmail() {
    setEmailSuccess(null);
    setEmailError(null);
    try {
      if (!prescription || !booking) {
        setEmailError('Không có thông tin đơn thuốc hoặc đặt lịch.');
        return;
      }

      await PrescriptionService.sendPrescriptionEmail(
        booking.id,
        prescription[0].id
      );

      setEmailSuccess('Đã gửi email đơn thuốc cho bệnh nhân!');
      toast.success('Đã gửi email đơn thuốc cho bệnh nhân!');

      // Fetch the updated prescription detail (in case status changes)
      await fetchPrescription();
    } catch {
      setEmailError('Không thể gửi email.');
      toast.error('Không thể gửi email.');
    }
  }
  useEffect(() => {
    fetchPrescription();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!booking) return null;

  // PatientModal definition (move above return)
  const PatientModal = ({ patient, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500 bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-200 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          {patient.account?.userAvatar ? (
            <img
              src={`http://localhost:5000${patient.account.userAvatar}`}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow mb-3 bg-gray-100"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-400 mb-3 border-4 border-blue-200 shadow">
              <span>{patient.patientName?.charAt(0) || '?'}</span>
            </div>
          )}
          <h3 className="text-2xl font-bold text-blue-700 mb-2 mt-1">
            {patient.patientName}
          </h3>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-700 w-28">Giới tính:</span>
            <span className="text-gray-700">
              {patient.account.userGender === true ? 'Nam' : 'Nữ'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-700 w-28">Ngày sinh:</span>
            <span className="text-gray-700">
              {patient.account.userDoB
                ? new Date(patient.account.userDoB).toLocaleDateString('vi-VN')
                : '-'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-700 w-28">Địa chỉ:</span>
            <span className="text-gray-700">{patient.account.userAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-700 w-28">Email:</span>
            <span className="text-gray-700">{patient.patientEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-700 w-28">
              Số điện thoại:
            </span>
            <span className="text-gray-700">{patient.patientPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
  console.log(prescription);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <button
          className="mb-6 text-blue-600 hover:underline flex items-center"
          onClick={() => navigate(-1)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </button>
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Chi tiết đặt lịch khám
        </h2>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="font-semibold text-blue-700 mb-1">
            Bệnh nhân:{' '}
            <span
              className="text-blue-900 cursor-pointer hover:underline"
              onClick={() => setShowPatientModal(true)}
            >
              {booking.patient?.patientName}
            </span>
            <button
              className="ml-3 text-xs text-blue-600 underline hover:text-blue-800"
              onClick={() => {
                if (role === 'admin') {
                  navigate(`/admin/patients/${booking.patientId}/bookings`);
                } else {
                  navigate(`/patients/${booking.patientId}/bookings`);
                }
              }}
            >
              Xem lịch sử đặt khám
            </button>
          </div>
          <div className="text-gray-700 mb-1">Ngày: {booking.bookingDate}</div>
          <div className="text-gray-700 mb-1">
            Thời gian: {booking.bookingStartTime} - {booking.bookingEndTime}
          </div>
          <div className="text-gray-700 mb-1">
            Lý do khám: {booking.bookingReason}
          </div>
          <div className="text-gray-700 mb-1">
            Trạng thái:{' '}
            <span className="font-semibold text-blue-700">
              {booking.bookingStatus}
            </span>
          </div>
          <div className="text-gray-700">
            Giá khám:{' '}
            <span className="text-blue-700 font-semibold">
              {Number(booking.bookingPrice).toLocaleString()} VNĐ
            </span>
          </div>
          {/* Cancel button logic */}
          {(booking.bookingStatus === 'Chờ xác nhận' ||
            booking.bookingStatus === 'Đã xác nhận') && (
            <div className="mt-6 flex flex-col gap-2">
              <button
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleCancelBooking}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Đang hủy...' : 'Hủy lịch khám'}
              </button>
              {cancelError && (
                <div className="text-red-500 text-sm text-center">
                  {cancelError}
                </div>
              )}
              {cancelSuccess && (
                <div className="text-green-600 text-sm text-center">
                  {cancelSuccess}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Prescription actions */}
        <div className="mt-8">
          {prescriptionLoading && (
            <div className="text-center text-blue-600">
              Đang tải đơn thuốc...
            </div>
          )}
          {prescriptionError && (
            <div className="text-center text-red-500">{prescriptionError}</div>
          )}
          {prescription.length === 0 &&
            !showPrescriptionForm &&
            booking.bookingStatus === 'Đã xác nhận' && (
              <button
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg"
                onClick={() => setShowPrescriptionForm(true)}
              >
                Gửi kết quả & đơn thuốc
              </button>
            )}
          {showPrescriptionForm && (
            <PrescriptionForm
              booking={booking}
              doctor={booking.doctor}
              onSubmit={handlePrescriptionSubmit}
            />
          )}
          {prescription && (
            <PrescriptionDetail
              isSent={
                booking.bookingStatus === 'Đã hoàn thành' &&
                prescription.length > 0
              }
              prescription={prescription}
              onEdit={() => setShowPrescriptionForm(true)}
              onSendEmail={handleSendEmail}
            />
          )}
          {emailSuccess && (
            <div className="text-green-600 text-center mt-2">
              {emailSuccess}
            </div>
          )}
          {emailError && (
            <div className="text-red-500 text-center mt-2">{emailError}</div>
          )}
        </div>
      </div>
      {showPatientModal && booking.patient && (
        <PatientModal
          patient={booking.patient}
          onClose={() => setShowPatientModal(false)}
        />
      )}
    </div>
  );
}

export default BookingDetailDoctor;
