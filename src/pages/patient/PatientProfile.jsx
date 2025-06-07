import React, { useCallback, useEffect, useState } from 'react';
import patientService from '../../services/patient.service';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

const PatientProfile = () => {
  const navigate = useNavigate();
  let currentAccount = null;

  try {
    currentAccount = JSON.parse(localStorage.getItem('account'));
  } catch {
    currentAccount = null;
  }

  const patientId = currentAccount?.patient?.id;

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const baseUrl = 'http://localhost:5000';

  const fetchPatient = useCallback(async () => {
    setLoading(true);

    try {
      const response = await patientService.getPatientById(patientId);
      console.log(response);
      setPatient(response.data || response); // handle both .data and direct
    } catch (err) {
      console.log(err);
      setError('Không thể tải thông tin bệnh nhân.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleLogout = () => {
    localStorage.removeItem('account');
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận không khớp.');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await AuthService.changePassword(
        currentAccount.id,
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      if (res.status !== 200) {
        setPasswordError(res.message || 'Đổi mật khẩu thất bại');
        throw new Error(res.message || 'Đổi mật khẩu thất bại');
      }
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        setOpenPasswordModal(false);
        localStorage.removeItem('account');
        navigate('/login');
      }, 1200);
    } catch (err) {
      console.log(err);
      setPasswordLoading(false);
      setPasswordError('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setPasswordLoading(false);
    }
  };

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

  if (!patient) {
    return null;
  }

  const { patientName, patientPhone, account } = patient;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Thông tin cá nhân
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
          <span>{patientName}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Số điện thoại: </span>
          <span>{patientPhone}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-700">Email: </span>
          <span>{account?.email || '-'}</span>
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
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => (window.location.href = '/me/edit')}
          >
            Chỉnh sửa
          </button>
          <button
            onClick={handleOpenPasswordModal}
            className="bg-yellow-500 py-2 px-8 rounded text-white hover:bg-yellow-600 transition font-semibold"
          >
            Đổi mật khẩu
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 py-2 px-8 rounded text-white hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
      <Dialog
        open={openPasswordModal}
        onClose={handleClosePasswordModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <form onSubmit={handleSubmitPassword}>
          <DialogContent dividers>
            <div className="space-y-2">
              <div>
                <label className="block font-medium mb-1">Mật khẩu cũ</label>
                <div className="relative">
                  <input
                    type={showPassword.old ? 'text' : 'password'}
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <IconButton
                    onClick={() => handleShowPassword('old')}
                    edge="end"
                    className="!absolute right-2 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                    size="small"
                  >
                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <IconButton
                    onClick={() => handleShowPassword('new')}
                    edge="end"
                    className="!absolute right-2 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                    size="small"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <IconButton
                    onClick={() => handleShowPassword('confirm')}
                    edge="end"
                    className="!absolute right-2 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                    size="small"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>
              {passwordError && (
                <div className="text-red-600 text-center mt-2">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="text-green-600 text-center mt-2">
                  {passwordSuccess}
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              onClick={handleClosePasswordModal}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              disabled={passwordLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default PatientProfile;
