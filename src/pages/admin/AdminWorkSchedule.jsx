import React, { useEffect, useState } from 'react';
import doctorScheduleService from '../../services/doctorSchedule.service';
import DataTable from '../../components/DataTable';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const AdminWorkSchedule = () => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchWorkSchedules = async () => {
    setLoading(true);
    try {
      const data = await doctorScheduleService.getAllWorkSchdules();
      console.log(data);
      setWorkSchedules(data || []);
    } catch (error) {
      console.log(error);
      toast.error('Không thể tải danh sách lịch làm việc.');
      setWorkSchedules([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkSchedules();
  }, []);

  // Filter by date
  const filteredRows = selectedDate
    ? workSchedules.filter(
        (item) => dayjs(item.workDate).format('YYYY-MM-DD') === selectedDate
      )
    : workSchedules;

  // Approve/Reject handlers
  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await doctorScheduleService.approve(id, true);
      toast.success('Duyệt lịch làm việc thành công!');
      fetchWorkSchedules();
    } catch (error) {
      console.log(error);
      toast.error('Duyệt lịch làm việc thất bại!');
    }
    setProcessingId(null);
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await doctorScheduleService.reject(id, false);
      toast.success('Từ chối lịch làm việc thành công!');
      fetchWorkSchedules();
    } catch (error) {
      console.log(error);
      toast.error('Từ chối lịch làm việc thất bại!');
    }
    setProcessingId(null);
  };

  // DataTable columns
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      headerAlign: 'center',
      align: 'center',
      width: 70,
    },
    {
      field: 'doctor',
      headerName: 'Bác sĩ',
      headerAlign: 'center',
      flex: 1.2,
      valueGetter: (params) => {
        return params?.doctorName || '-';
      },
    },
    {
      field: 'workDate',
      headerName: 'Ngày làm',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params) => dayjs(params.workDate).format('DD/MM/YYYY'),
    },
    {
      field: 'schedule',
      headerName: 'Thời gian',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params) => {
        console.log(params);
        return params
          ? `${params?.startTime.slice(0, 5)} - ${params?.endTime.slice(0, 5)}`
          : '-';
      },
    },
    {
      field: 'currentPatients',
      headerName: 'Số bệnh nhân',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'isAvailable',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      renderCell: (params) =>
        params.isAvailable ? (
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
            Còn trống
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
            Hết chỗ
          </span>
        ),
    },
    {
      field: 'isConfirmed',
      headerName: 'Xác nhận',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) =>
        params.isConfirmed ? (
          <span className="px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-semibold">
            Đã duyệt
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
            Chờ duyệt
          </span>
        ),
    },
    {
      field: 'actions',
      headerName: 'Chức năng',
      headerAlign: 'center',
      flex: 1.2,
      align: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            size="small"
            variant="contained"
            color="success"
            disabled={params.isConfirmed || processingId === params.id}
            onClick={() => handleApprove(params.id)}
          >
            {processingId === params.id ? (
              <CircularProgress size={18} />
            ) : (
              'Duyệt'
            )}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            disabled={params.isConfirmed || processingId === params.id}
            onClick={() => handleReject(params.id)}
          >
            {processingId === params.id ? (
              <CircularProgress size={18} />
            ) : (
              'Từ chối'
            )}
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Quản lý lịch làm việc bác sĩ
      </h1>
      <div className="flex items-center gap-4 mb-4">
        <TextField
          type="date"
          label="Lọc theo ngày"
          size="small"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" onClick={() => setSelectedDate('')}>
          Xóa lọc
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <CircularProgress color="info" size={40} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows}
          checkboxSelection={false}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </div>
  );
};

export default AdminWorkSchedule;
