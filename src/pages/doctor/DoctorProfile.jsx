import React, { useCallback, useEffect, useMemo, useState } from 'react';
import doctorService from '../../services/doctor.service';
import { CircularProgress } from '@mui/material';
import statisticService from '../../services/statistic.service';

const DoctorProfile = () => {
  let currentAccount = null;
  try {
    currentAccount = JSON.parse(localStorage.getItem('account'));
  } catch {
    currentAccount = null;
  }
  const doctorId = currentAccount?.doctor?.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = 'http://localhost:5000';

  const currentMonth = useMemo(() => new Date().getMonth(), []);

  const [doctorRevenues, setDoctorRevenues] = useState();

  const fetchDotorRevenue = useCallback(async () => {
    setLoading(true);
    const response = await statisticService.getDoctorRevenueStatistics({
      month: currentMonth,
    });

    const [doctorRevenue] = response.filter(
      (item) => item.doctorId === doctorId
    );

    setDoctorRevenues(doctorRevenue);
  }, [currentMonth, doctorId]);

  useEffect(() => {
    fetchDotorRevenue();
  }, [fetchDotorRevenue]);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await doctorService.getDoctorById(doctorId);
        setDoctor(response.data || response);
      } catch (err) {
        console.log(err);
        setError('Không thể tải thông tin bác sĩ.');
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 text-center">
        {error}
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  const {
    doctorName,
    doctorTitle,
    doctorSortDesc,
    doctorDetailDesc,
    examinationPrice,
    specialty,
    account,
  } = doctor;

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-10 mt-12 border border-blue-100">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center tracking-tight drop-shadow-lg">
        Thông tin bác sĩ
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img
            src={
              account?.userAvatar
                ? `${baseUrl}${account?.userAvatar}`
                : '/public/DoctorLogin.png'
            }
            alt="Avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-300 shadow-lg bg-white"
          />
          <span className="mt-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shadow">
            {doctorTitle}
          </span>
        </div>
        <div className="flex-1 w-full space-y-4 text-base text-gray-700">
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-blue-700 min-w-[110px]">
              Họ và tên:
            </span>
            <span>{doctorName}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-blue-700 min-w-[110px]">
              Chuyên khoa:
            </span>
            <span>{specialty?.specialtyName || '-'}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-blue-700 min-w-[110px]">
              Giới tính:
            </span>
            <span>
              {account?.userGender === true
                ? 'Nam'
                : account?.userGender === false
                ? 'Nữ'
                : 'Khác'}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-blue-700 min-w-[110px]">
              Ngày sinh:
            </span>
            <span>
              {account?.userDoB
                ? new Date(account.userDoB).toLocaleDateString('vi-VN')
                : '-'}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-blue-700 min-w-[110px]">
              Địa chỉ:
            </span>
            <span>{account?.userAddress || '-'}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-blue-700 min-w-[110px]">
              Giá khám:
            </span>
            <span className="text-green-700 font-bold">
              {examinationPrice
                ? `${examinationPrice.toLocaleString('vi-VN')} VNĐ`
                : '-'}
            </span>
          </div>
        </div>
      </div>
      {doctorRevenues && (
        <div className="my-6 w-full flex items-center gap-2">
          <div className="bg-white/80 border border-blue-100 rounded-lg px-4 py-2 shadow text-center w-full">
            <span className="block text-xs text-blue-700 font-semibold mb-1">
              Doanh thu tháng này
              {console.log(doctorRevenues)}
            </span>
            <span className="text-lg font-bold text-green-700">
              {doctorRevenues.revenue?.toLocaleString('vi-VN') || 0} VNĐ
            </span>
          </div>
          <div className="bg-white/80 border border-blue-100 rounded-lg px-4 py-2 shadow text-center w-full">
            <span className="block text-xs text-blue-700 font-semibold mb-1">
              Lịch khám hoàn thành
            </span>
            <span className="text-lg font-bold text-blue-700">
              {doctorRevenues.totalCompleteBookings || 0}
            </span>
          </div>
        </div>
      )}
      <div className="bg-blue-50 rounded-xl p-6 shadow-inner mb-6">
        <div className="mb-2">
          <span className="font-semibold text-blue-700">Mô tả ngắn: </span>
          <span>{doctorSortDesc || '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Mô tả chi tiết: </span>
          <span>{doctorDetailDesc || '-'}</span>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition text-base"
          onClick={() => (window.location.href = '/doctor/profile/edit')}
        >
          Chỉnh sửa hồ sơ
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
