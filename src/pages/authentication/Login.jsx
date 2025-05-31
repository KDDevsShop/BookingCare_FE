import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(credentials);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('account', JSON.stringify(response.account));
        toast.success('Đăng nhập thành công!');
        if (response.account?.role === 'admin') {
          navigate('/dashboard');
        } else if (response.account?.role === 'doctor') {
          navigate('/doctor/bookings');
        } else if (response.account?.role === 'patient') {
          navigate('/homepage');
        }
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      console.log(err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Bên trái / Hình minh họa */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 text-white p-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Chào mừng trở lại!
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Đăng nhập để trải nghiệm dịch vụ chăm sóc sức khỏe cá nhân hóa tại
              Phòng Khám Thu Cúc.
            </p>
            <img
              src="/public/DoctorLogin.png"
              alt="Doctor Illustration"
              className="w-64 mx-auto rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Bên phải / Form đăng nhập */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-blue-100">
            <Link
              to="/"
              className="mr-6 pb-2 text-blue-700 font-bold border-b-4 border-blue-600 transition-all duration-200"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="pb-2 text-gray-400 hover:text-blue-600 hover:border-b-4 hover:border-blue-600 font-semibold transition-all duration-200"
            >
              Đăng ký
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold mb-2 text-blue-700">
            Đăng nhập vào Phòng Khám Thu Cúc
          </h2>
          <p className="text-gray-500 mb-8">
            Nhập username và mật khẩu để tiếp tục
          </p>

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Username
              </label>
              <input
                onChange={handleChange}
                value={credentials.username}
                type="text"
                name="username"
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
                placeholder="Nhập username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Mật khẩu
              </label>
              <input
                name="password"
                onChange={handleChange}
                value={credentials.password}
                type="password"
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
                placeholder="Nhập mật khẩu"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-lg shadow-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <CircularProgress size={'1.5rem'} color="inherit" />
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-500">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
