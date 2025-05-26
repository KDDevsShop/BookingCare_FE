import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      toast.success(
        "Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn."
      );
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4">
      <div className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-8 sm:p-12 flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
          alt="Reset Password"
          className="w-20 h-20 mb-4"
        />
        <h2 className="text-2xl font-extrabold mb-2 text-blue-700 text-center">
          Quên mật khẩu?
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
              placeholder="Nhập email của bạn"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-lg shadow-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <CircularProgress size={"1.5rem"} color="inherit" />
            ) : (
              "Gửi liên kết đặt lại mật khẩu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
