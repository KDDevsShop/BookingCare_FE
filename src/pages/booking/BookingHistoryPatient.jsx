import React, { useEffect, useState } from 'react';
import BookingService from '../../services/booking.service';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

const statusColors = {
  'Chờ xác nhận': 'bg-blue-100 text-blue-700',
  'Đã xác nhận': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
  'Đã hoàn thành': 'bg-gray-100 text-gray-700',
};

function BookingHistoryPatient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await BookingService.getAllBookingsByPatientId(id);
        setBookings(res || []);
      } catch {
        setError('Không thể tải danh sách đặt lịch.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [id]);

  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.bookingStatus === statusFilter)
    : bookings;

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(true);
    setCancelError(null);
    setCancelSuccess(null);
    try {
      const res = await BookingService.cancelBooking(bookingId);
      const msg = res?.message;
      if (msg === 'Bạn chỉ có thể hủy lịch trước giờ hẹn ít nhất 1 tiếng.') {
        toast.error(msg);
      } else {
        toast.success('Đã hủy lịch thành công.');
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, bookingStatus: 'Đã hủy' } : b
          )
        );
      }
    } catch (error) {
      setCancelError('Không thể hủy lịch khám. Vui lòng thử lại.');
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'doctorName',
      headerName: 'Bác sĩ',
      flex: 1.5,
      renderCell: (params) => params.row.doctor?.doctorName || '-',
    },
    { field: 'bookingDate', headerName: 'Ngày', width: 120 },
    {
      field: 'time',
      headerName: 'Thời gian',
      width: 200,
      renderCell: (params) =>
        `${params.row.bookingStartTime} - ${params.row.bookingEndTime}`,
    },
    {
      field: 'bookingReason',
      headerName: 'Lý do khám',
      flex: 2,
    },
    {
      field: 'bookingStatus',
      headerName: 'Trạng thái',
      width: 140,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            statusColors[params.value] || 'bg-gray-100 text-gray-700'
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Chức năng',
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2 p-3">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm font-semibold"
            onClick={() => navigate(`/doctor/booking-history/${params.row.id}`)}
          >
            Xem
          </button>
          {params.row.bookingStatus === 'Chờ xác nhận' && (
            <button
              className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-lg shadow hover:from-blue-500 hover:to-blue-800 transition text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => handleCancelBooking(params.row.id)}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Đang hủy...' : 'Hủy'}
            </button>
          )}
        </div>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Lịch sử đặt khám của bệnh nhân
        </h2>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <label className="font-medium text-blue-700">
            Lọc theo trạng thái:
          </label>
          <select
            className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đã hủy">Đã hủy</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {cancelError && (
          <div className="text-red-500 mb-4 text-center">{cancelError}</div>
        )}
        {cancelSuccess && (
          <div className="text-green-600 mb-4 text-center">{cancelSuccess}</div>
        )}
        <div style={{ height: 550, width: '100%' }}>
          <DataGrid
            rows={filteredBookings}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8, 16, 32]}
            loading={loading}
            getRowId={(row) => row.id}
            className="!border-blue-100"
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                background: '#e0e7ff',
                color: '#1e40af',
                fontWeight: 700,
                fontSize: 16,
              },
              '& .MuiDataGrid-row': {
                background: '#f8fafc',
                borderRadius: 2,
              },
              '& .MuiDataGrid-cell': {
                fontSize: 15,
              },
              '& .MuiDataGrid-footerContainer': {
                background: '#e0e7ff',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BookingHistoryPatient;
