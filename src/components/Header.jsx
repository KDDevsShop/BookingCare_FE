import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  // Parse account from localStorage
  let account = null;
  const baseUrl = "http://localhost:5000";
  try {
    account = JSON.parse(localStorage.getItem("account"));
  } catch {
    account = null;
  }
  const isDoctor = account?.role === "doctor";
  const isPatient = account?.role === "patient";
  const avatarUrl = account?.userAvatar ? account.userAvatar : ``; // fallback to default if not a valid url
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          BookingCare - Nền tảng y tế sức khỏe toàn diện
        </h1>
        <div className="flex items-center gap-6">
          <ul className="flex items-center space-x-8">
            <li>
              <button
                onClick={() => navigate("/doctors")}
                className="text-white hover:underline hover:opacity-90 transition font-semibold text-lg"
              >
                Tìm bác sĩ
              </button>
            </li>
            {isPatient && (
              <li>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="bg-white text-blue-600 py-2 px-4 rounded-md shadow-sm hover:bg-blue-100 font-semibold transition-all border border-blue-200"
                >
                  Lịch đăng ký khám
                </button>
              </li>
            )}
            {isPatient || isDoctor ? (
              <>
                <li>
                  <button
                    onClick={() =>
                      navigate(isDoctor ? "/doctor/profile" : "/me")
                    }
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-semibold cursor-pointer overflow-hidden"
                  >
                    <img
                      src={
                        avatarUrl
                          ? `${baseUrl}${avatarUrl}`
                          : "/public/DoctorLogin.png"
                      }
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="text-white hover:opacity-80 transition-opacity"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 transition-all"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
