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

function DoctorBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const account = JSON.parse(localStorage.getItem('account'));
        if (!account || account.role !== 'doctor') {
          setError('Bạn cần đăng nhập tài khoản bác sĩ để xem lịch khám.');
          navigate('/');
          setBookings([]);
          return;
        }
        const res = await BookingService.getAllBookingsByDoctorId(
          account.doctor.id
        );
        setBookings(res || []);
      } catch {
        setError('Không thể tải danh sách lịch khám.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Filter bookings by status
  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.bookingStatus === statusFilter)
    : bookings;

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'patientName',
      headerName: 'Bệnh nhân',
      flex: 1.5,
      renderCell: (params) => params.row.patient?.patientName || '-',
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
  ];

  const handleView = (params) => {
    console.log('params');
    navigate(`/doctor/booking/${params.row.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Quản lý lịch khám của bạn
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
            onView={handleView}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default DoctorBookingsPage;
