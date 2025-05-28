import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingService from "../../services/booking.service";
import { toast } from "react-toastify";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, schedule } = location.state || {};

  const [form, setForm] = useState({
    bookingReason: "",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  React.useEffect(() => {
    // Prefill form with account info if available
    const account = JSON.parse(localStorage.getItem("account"));
    if (account && account.role === "patient" && account.patient) {
      setForm((prev) => ({
        ...prev,
        patientName: account.patient.patientName || "",
        patientPhone: account.patient.patientPhone || "",
        patientEmail: account.patient.patientEmail || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Get patientId from localStorage (assume patient is logged in)
      const account = JSON.parse(localStorage.getItem("account"));
      if (!account || account.role !== "patient") {
        setError("Bạn cần đăng nhập tài khoản bệnh nhân để đặt lịch.");
        setSubmitting(false);
        return;
      }
      const patientId = account.patient.id;
      // Prepare booking data
      const bookingData = {
        bookingReason: form.bookingReason,
        bookingDate: schedule.workDate,
        bookingStartTime: schedule.schedule?.startTime,
        bookingEndTime: schedule.schedule?.endTime,
        patientId,
        doctorId: doctor.id,
      };
      const res = await BookingService.createBooking(bookingData);
      const bookingId = res?.booking?.id;
      console.log(res);
      toast.success("Đặt lịch thành công!");
      if (bookingId) {
        navigate(`/booking/${bookingId}`);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor || !schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <div className="text-blue-700 font-semibold mb-4">
            Thiếu thông tin đặt lịch.
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
          Đặt lịch khám với bác sĩ
        </h2>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="font-semibold text-blue-700 mb-1">
            Bác sĩ: <span className="text-blue-900">{doctor.doctorName}</span>
          </div>
          <div className="text-gray-700 mb-1">
            Chuyên khoa: {doctor.specialty?.specialtyName || "-"}
          </div>
          <div className="text-gray-700 mb-1">Ngày: {schedule.workDate}</div>
          <div className="text-gray-700 mb-1">
            Thời gian: {schedule.schedule?.startTime} -{" "}
            {schedule.schedule?.endTime}
          </div>
          <div className="text-gray-700">
            Giá khám:{" "}
            <span className="text-blue-700 font-semibold">
              {Number(doctor.examinationPrice).toLocaleString()} VNĐ
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-blue-700 font-medium mb-1">
              Lý do khám
            </label>
            <input
              type="text"
              name="bookingReason"
              value={form.bookingReason}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Nhập lý do khám..."
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">
              Tên bệnh nhân
            </label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Nhập tên bệnh nhân..."
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="patientPhone"
              value={form.patientPhone}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Nhập số điện thoại..."
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="patientEmail"
              value={form.patientEmail}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Nhập email..."
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Đang đặt lịch..." : "Đặt lịch ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
