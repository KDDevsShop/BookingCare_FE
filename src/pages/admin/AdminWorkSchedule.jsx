import React, { useEffect, useState } from 'react';
import doctorScheduleService from '../../services/doctorSchedule.service';
import DataTable from '../../components/DataTable';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DoctorService from '../../services/doctor.service';
import scheduleService from '../../services/schedule.service';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const AdminWorkSchedule = () => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [allSchedules, setAllSchedules] = useState([]);
  const [chosenShifts, setChosenShifts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalWorkDate, setModalWorkDate] = useState(
    dayjs().format('DD-MM-YYYY')
  );
  const [registering, setRegistering] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await DoctorService.getAllDoctors();
        setDoctors(res || []);
      } catch {
        setDoctors([]);
      }
    }
    fetchDoctors();
  }, []);

  const fetchAllSchedules = async () => {
    setModalLoading(true);
    try {
      const data = await scheduleService.getAllSchedules();
      setAllSchedules(data || []);
    } catch (error) {
      console.log(error);
      toast.error('Không thể tải danh sách ca làm.');
      setAllSchedules([]);
    }
    setModalLoading(false);
  };

  // Filter by date, doctor name, and status
  const filteredRows = workSchedules.filter((item) => {
    const matchesDate = selectedDate
      ? dayjs(item.workDate).format('YYYY-MM-DD') === selectedDate
      : true;

    const matchesDoctor =
      searchDoctor.trim() === ''
        ? true
        : (item.doctor.doctorName || '')
            .toLowerCase()
            .includes(searchDoctor.trim().toLowerCase());

    const matchesStatus =
      statusFilter === ''
        ? true
        : statusFilter === 'approved'
        ? item.isConfirmed === true
        : item.isConfirmed === false;

    return matchesDate && matchesDoctor && matchesStatus;
  });

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
      valueGetter: (params) => {
        return dayjs(params?.value || params).format('DD/MM/YYYY');
      },
    },
    {
      field: 'schedule',
      headerName: 'Thời gian',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params) => {
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
      renderCell: (params) => {
        return params?.value ? (
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
            Còn trống
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
            Hết chỗ
          </span>
        );
      },
    },
    {
      field: 'isConfirmed',
      headerName: 'Xác nhận',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        return params?.value ? (
          <span className="px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-semibold">
            Đã duyệt
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
            Chờ duyệt
          </span>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Chức năng',
      headerAlign: 'center',
      flex: 1.2,
      align: 'center',
      renderCell: (params) => {
        return !params?.row?.isConfirmed ? (
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
        ) : (
          <Button variant="contained" color="error">
            Xóa lịch làm
          </Button>
        );
      },
    },
  ];

  const handleOpenModal = () => {
    setModalWorkDate(dayjs().format('YYYY-MM-DD'));
    setOpenModal(true);
    setSelectedDoctor('');
    setChosenShifts([]);
    fetchAllSchedules();
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setChosenShifts([]);
  };

  // Get current date and time in Vietnam timezone (UTC+7)
  const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const todayVN = nowVN.toISOString().split('T')[0];
  const currentTimeVN = nowVN.toISOString().split('T')[1].split(':')[0]; // 'HH:MM'

  const availableShifts = allSchedules.filter((sch) => {
    const isAlreadyRegistered = sch.doctorSchedules?.some(
      (ds) =>
        ds.workDate === modalWorkDate && ds.doctorId === Number(selectedDoctor)
    );

    const isAlreadyChosen = chosenShifts.includes(sch.id);

    let isPast = false;

    if (modalWorkDate === todayVN) {
      if (sch.startTime && sch.startTime.split(':')[0] < currentTimeVN) {
        isPast = true;
      }
    }

    console.log(isAlreadyRegistered, isAlreadyChosen, isPast);

    return !isAlreadyRegistered && !isAlreadyChosen && !isPast;
  });

  const selectedShifts = allSchedules.filter((sch) =>
    chosenShifts.includes(sch.id)
  );

  const handleChooseShift = (id) => {
    setChosenShifts((prev) => [...prev, id]);
  };
  const handleRemoveShift = (id) => {
    setChosenShifts((prev) => prev.filter((sid) => sid !== id));
  };

  const handleRegisterShifts = async () => {
    if (!modalWorkDate || chosenShifts.length === 0 || !selectedDoctor) {
      toast.error('Vui lòng chọn bác sĩ, ngày và ít nhất một ca làm.');
      return;
    }
    setRegistering(true);
    try {
      await Promise.all(
        chosenShifts.map((scheduleId) =>
          doctorScheduleService.createSchedule(
            Number(selectedDoctor),
            scheduleId,
            modalWorkDate,
            true
          )
        )
      );
      toast.success('Tạo ca làm thành công!');
      setOpenModal(false);
      setChosenShifts([]);
      fetchWorkSchedules();
    } catch (error) {
      console.log(error);
      toast.error('Tạo ca làm thất bại.');
    }
    setRegistering(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Quản lý lịch làm việc bác sĩ
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-2">
          <TextField
            label="Tìm kiếm bác sĩ"
            size="small"
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
            placeholder="Nhập tên bác sĩ..."
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Lọc trạng thái"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: 140 }}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="pending">Chưa duyệt</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
          >
            Tạo lịch làm việc
          </Button>
        </div>
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
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Tạo lịch làm việc
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel id="doctor-select-label">Chọn bác sĩ</InputLabel>
            <Select
              labelId="doctor-select-label"
              value={selectedDoctor}
              label="Chọn bác sĩ"
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setChosenShifts([]);
              }}
            >
              {doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.doctorTitle} {doc.doctorName}
                  {doc.specialty
                    ? ` - khoa ${doc.specialty.specialtyName}`
                    : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="my-4 flex flex-col md:flex-row gap-4 items-center">
            <label className="font-medium text-gray-700">
              Chọn ngày làm việc:
            </label>
            <input
              type="date"
              value={modalWorkDate}
              min={dayjs().format('YYYY-MM-DD')}
              onChange={(e) => {
                setModalWorkDate(e.target.value);
                setChosenShifts([]);
              }}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {modalLoading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress color="info" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="font-semibold mb-2 text-blue-700">
                  Ca đã chọn:
                </div>
                {selectedShifts.length === 0 ? (
                  <div className="italic text-gray-500">Chưa chọn ca nào.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedShifts.map((sch) => (
                      <Button
                        key={sch.id}
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleRemoveShift(sch.id)}
                      >
                        {sch.startTime.slice(0, 5)} - {sch.endTime.slice(0, 5)}{' '}
                        (Bỏ chọn)
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <div className="font-semibold mb-2 text-blue-700">
                Ca chưa chọn:
              </div>
              <div className="flex flex-wrap gap-2">
                {availableShifts.length === 0 ? (
                  <div className="italic text-gray-500">
                    Không còn ca nào để chọn.
                  </div>
                ) : (
                  availableShifts.map((sch) => (
                    <Button
                      key={sch.id}
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleChooseShift(sch.id)}
                    >
                      {sch.startTime.slice(0, 5)} - {sch.endTime.slice(0, 5)}
                    </Button>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            disabled={registering}
          >
            Đóng
          </Button>
          <Button
            onClick={handleRegisterShifts}
            color="primary"
            variant="contained"
            disabled={
              registering ||
              chosenShifts.length === 0 ||
              !modalWorkDate ||
              !selectedDoctor
            }
          >
            {registering ? <CircularProgress size={20} /> : 'Đăng ký'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminWorkSchedule;
