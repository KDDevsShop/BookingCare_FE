import React, { useEffect, useState } from 'react';
import doctorService from '../../services/doctor.service';
import { CircularProgress } from '@mui/material';

const DoctorProfile = () => {
  let currentAccount = null;
  try {
    currentAccount = JSON.parse(localStorage.getItem('account'));
  } catch {
    currentAccount = null;
  }
  const doctorId = currentAccount?.doctor?.id;
  console.log(currentAccount);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await doctorService.getDoctorById(doctorId);
        setDoctor(response.data || response);
      } catch (err) {
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
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Thông tin bác sĩ
      </h2>
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            account?.userAvatar
              ? `${baseUrl}${account?.userAvatar}`
              : '/public/DoctorLogin.png'
          }
          alt="Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
        />
      </div>
      <div className="space-y-4">
        <div>
          <span className="font-semibold text-blue-700">Họ và tên: </span>
          <span>{doctorName}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Chức danh: </span>
          <span>{doctorTitle}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Chuyên khoa: </span>
          <span>{specialty?.specialtyName || '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Giới tính: </span>
          <span>
            {account?.userGender === true
              ? 'Nam'
              : account?.userGender === false
              ? 'Nữ'
              : 'Khác'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Ngày sinh: </span>
          <span>
            {account?.userDoB
              ? new Date(account.userDoB).toLocaleDateString('vi-VN')
              : '-'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Địa chỉ: </span>
          <span>{account?.userAddress || '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Giá khám: </span>
          <span>{examinationPrice ? `${examinationPrice} VNĐ` : '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Mô tả ngắn: </span>
          <span>{doctorSortDesc || '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Mô tả chi tiết: </span>
          <span>{doctorDetailDesc || '-'}</span>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => (window.location.href = '/doctor/profile/edit')}
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
