import { CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';
  const token = params.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, token }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.');
      } else {
        toast.error(
          data.message || 'Đặt lại mật khẩu không thành công. Vui lòng thử lại.'
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err?.message || err || 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu.'
      );
    }
    setLoading(false);
  };

  const handleChangeConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== newPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset}>
        <div>
          <label>Email</label>
          <input type='email' value={email} disabled className='w-full ' />
        </div>
        <div>
          <label>Mật khẩu mới</label>
          <input
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className='w-full '
          />
        </div>
        <div>
          <label>Xác nhận mật khẩu</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            required
            className='w-full '
          />
        </div>
        <button type='submit' disabled={loading || !newPassword}>
          {loading ? (
            <CircularProgress size={'1.25rem'} color='inherit' />
          ) : (
            'Xác nhận'
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
