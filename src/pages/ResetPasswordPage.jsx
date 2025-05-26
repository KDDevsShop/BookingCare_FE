import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, token, newPassword });
      toast.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.");
      navigate("/");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Đặt lại mật khẩu không thành công. Vui lòng thử lại."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4">
      <div className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-8 sm:p-12 flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
          alt="Reset Password"
          className="w-20 h-20 mb-4"
        />
        <h2 className="text-2xl font-extrabold mb-2 text-blue-700 text-center">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleReset} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-blue-50 text-blue-900"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-lg shadow-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <CircularProgress size={"1.25rem"} color="inherit" />
            ) : (
              "Xác nhận"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
