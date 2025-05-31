import React, { useEffect, useState } from 'react';
import doctorScheduleService from '../../services/doctorSchedule.service';
import { useParams } from 'react-router-dom';
import {
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import scheduleService from '../../services/schedule.service';

const WorkSchedule = () => {
  const { id: doctorId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [allSchedules, setAllSchedules] = useState([]);
  const [chosenShifts, setChosenShifts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalWorkDate, setModalWorkDate] = useState(selectedDate);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const data = await doctorScheduleService.getSchedulesByDoctorId(
          doctorId
        );
        setSchedules(data || []);
      } catch (error) {
        console.log(error);
        toast.error(error?.message || error || 'Không thể tải lịch làm việc.');
        setSchedules([]);
      }
      setLoading(false);
    };
    if (doctorId) fetchSchedules();
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredSchedules(schedules);
      return;
    }
    setFilteredSchedules(
      schedules.filter(
        (item) => dayjs(item.workDate).format('YYYY-MM-DD') === selectedDate
      )
    );
  }, [selectedDate, schedules]);

  // Fetch all schedules for modal
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

  const handleOpenModal = () => {
    setModalWorkDate(selectedDate);
    setOpenModal(true);
    fetchAllSchedules();
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setChosenShifts([]);
  };

  // Get chosen shifts for selectedDate
  const chosenShiftIds = schedules
    .filter((item) => item.workDate === selectedDate)
    .map((item) => item.schedule?.id);

  // Filter available/unavailable shifts for selectedDate
  const availableShifts = allSchedules.filter(
    (sch) =>
      !sch.doctorSchedules?.some(
        (ds) =>
          ds.workDate === modalWorkDate && ds.doctorId === Number(doctorId)
      ) && !chosenShifts.includes(sch.id)
  );
  const selectedShifts = allSchedules.filter((sch) =>
    chosenShifts.includes(sch.id)
  );

  // Handle choose/unchoose shift
  const handleChooseShift = (id) => {
    setChosenShifts((prev) => [...prev, id]);
  };
  const handleRemoveShift = (id) => {
    setChosenShifts((prev) => prev.filter((sid) => sid !== id));
  };

  // Register selected shifts
  const handleRegisterShifts = async () => {
    if (!modalWorkDate || chosenShifts.length === 0) {
      toast.error('Vui lòng chọn ngày và ít nhất một ca làm.');
      return;
    }
    setRegistering(true);
    try {
      await Promise.all(
        chosenShifts.map((scheduleId) =>
          doctorScheduleService.createSchedule(
            Number(doctorId),
            scheduleId,
            modalWorkDate
          )
        )
      );
      toast.success('Đăng ký ca làm thành công!');
      setOpenModal(false);
      setChosenShifts([]);
      // Refresh schedules after registration
      const data = await doctorScheduleService.getSchedulesByDoctorId(doctorId);
      setSchedules(data || []);
    } catch (error) {
      console.log(error);
      toast.error('Đăng ký ca làm thất bại.');
    }
    setRegistering(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Lịch làm việc của tôi
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <label className="font-medium text-gray-700 me-4">
              Lọc theo ngày:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            className="ml-auto"
          >
            Đăng ký ca làm
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <CircularProgress color="info" />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="text-center text-gray-500 italic py-16">
          Không có lịch làm việc cho ngày này.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center text-lg font-semibold text-gray-700">
                Ngày
              </th>
              <th className="px-4 py-2 text-center text-lg font-semibold text-gray-700">
                Thời gian
              </th>
              <th className="px-4 py-2 text-center text-lg font-semibold text-gray-700">
                Số bệnh nhân
              </th>
              <th className="px-4 py-2 text-center text-lg font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="px-4 py-2 text-center text-lg font-semibold text-gray-700">
                Xác nhận
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 text-center">
                  {dayjs(item.workDate).format('DD/MM/YYYY')}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.schedule
                    ? `${item.schedule.startTime.slice(
                        0,
                        5
                      )} - ${item.schedule.endTime.slice(0, 5)}`
                    : '-'}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.currentPatients}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.isAvailable ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                      Còn trống
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                      Đã kín
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.isConfirmed ? (
                    <span className="px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-semibold">
                      Đã duyệt
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                      Chờ duyệt
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Đăng ký ca làm
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
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
              registering || chosenShifts.length === 0 || !modalWorkDate
            }
          >
            {registering ? <CircularProgress size={20} /> : 'Đăng ký'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkSchedule;
