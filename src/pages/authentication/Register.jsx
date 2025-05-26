import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import authService from "../../services/auth.service";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    patientPhone: "",
    userGender: "",
    userDoB: "",
    userAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp.");
      setLoading(false);
      return;
    }
    try {
      const data = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        userDoB: formData.userDoB,
        userAddress: formData.userAddress,
        userGender:
          formData.userGender === "male"
            ? true
            : formData.userGender === "female"
            ? false
            : null,
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
      };
      await authService.signup(data);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      // Optionally, you can auto-clear error after a few seconds
      // setTimeout(() => setError(""), 4000);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left side illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-400 text-white p-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Chào mừng đến với Thu Cuc!
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Tạo tài khoản để trải nghiệm dịch vụ chăm sóc sức khỏe cá nhân hóa
              tại Thu Cuc.
            </p>
            <img
              src="/public/DoctorLogin.png"
              alt="Doctor Illustration"
              className="w-64 mx-auto rounded-xl shadow-lg border-4 border-blue-200"
            />
          </div>
        </div>
        {/* Right side registration form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-blue-100">
            <Link
              to="/"
              className="mr-6 pb-2 text-gray-400 hover:text-blue-600 hover:border-b-4 hover:border-blue-600 font-semibold transition-all duration-200"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="pb-2 text-blue-700 font-bold border-b-4 border-blue-600 transition-all duration-200"
            >
              Đăng ký
            </Link>
          </div>
          <h2 className="text-2xl font-extrabold mb-2 text-blue-700">
            Tạo tài khoản mới
          </h2>
          <p className="text-gray-500 mb-8">
            Tham gia cùng chúng tôi để nhận được dịch vụ tốt nhất!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                placeholder="you@example.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Giới tính
                </label>
                <select
                  name="userGender"
                  value={formData.userGender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 transition shadow-sm"
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="userDoB"
                  value={formData.userDoB}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 transition shadow-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="userAddress"
                value={formData.userAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                placeholder="Nhập địa chỉ (không bắt buộc)"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition shadow-sm"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-lg shadow-lg transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? (
                <CircularProgress size={"1.5rem"} color="inherit" />
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>
          <div className="mt-8 text-center text-gray-500">
            Đã có tài khoản?{" "}
            <Link
              to="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
