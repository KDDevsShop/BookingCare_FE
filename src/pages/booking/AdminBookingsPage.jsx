import React, { useEffect, useState } from 'react';
import BookingService from '../../services/booking.service';
import DataTable from '../../components/DataTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const statusColors = {
  'Chờ xác nhận': 'bg-blue-100 text-blue-700',
  'Đã xác nhận': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
  'Đã hoàn thành': 'bg-gray-100 text-gray-700',
};

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await BookingService.getAllBookings();
        setBookings(res || []);
      } catch {
        setError('Không thể tải danh sách lịch khám.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.bookingStatus === statusFilter)
    : bookings;

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(true);
    setCancelError(null);
    try {
      await BookingService.cancelBooking(bookingId);
      toast.success('Đã hủy lịch thành công.');
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, bookingStatus: 'Đã hủy' } : b
        )
      );
    } catch (error) {
      setCancelError(
        error?.response?.data?.message ||
          'Không thể hủy lịch khám. Vui lòng thử lại.'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'patientName',
      headerName: 'Bệnh nhân',
      flex: 1.5,
      renderCell: (params) => params.row.patient?.patientName || '-',
    },
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
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2 p-3">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm font-semibold"
            onClick={() => navigate(`/admin/booking/${params.row.id}`)}
          >
            Xem
          </button>
          {(params.row.bookingStatus === 'Chờ xác nhận' ||
            params.row.bookingStatus === 'Đã xác nhận') && (
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
          Quản lý lịch khám
        </h2>
        {/* Filter by bookingStatus */}
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
        <div style={{ height: 550, width: '100%' }}>
          <DataTable
            rows={filteredBookings}
            columns={columns}
            pageSize={8}
            checkboxSelection={false}
            disableSelectionOnClick={true}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminBookingsPage;
