import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from '../../services/booking.service';
import { toast } from 'react-toastify';

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      setLoading(true);
      try {
        const res = await BookingService.getBookingById(id);
        setBooking(res);
      } catch (err) {
        setError('Không thể tải chi tiết đặt lịch.');
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  async function handleCancelBooking() {
    setCancelLoading(true);
    setCancelError(null);
    setCancelSuccess(null);
    try {
      await BookingService.cancelBooking(id);
      setBooking({ ...booking, bookingStatus: 'Đã hủy' });
      toast.success('Đã hủy lịch thành công.');
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg === 'Bạn chỉ có thể hủy lịch trước giờ hẹn ít nhất 1 tiếng.') {
        toast.error(msg);
      } else {
        setCancelError(msg || 'Không thể hủy lịch khám. Vui lòng thử lại.');
      }
    } finally {
      setCancelLoading(false);
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <button
          className="mb-6 text-blue-600 hover:underline flex items-center"
          onClick={() => navigate('/my-bookings')}
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
            Bác sĩ:{' '}
            <span className="text-blue-900">{booking.doctor?.doctorName}</span>
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
          {booking.bookingStatus === 'Chờ xác nhận' && (
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
      </div>
    </div>
  );
}

export default BookingDetailPage;
