import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  let account = null;
  const baseUrl = 'http://localhost:5000';
  try {
    account = JSON.parse(localStorage.getItem('account'));
  } catch {
    account = null;
  }
  const isDoctor = account?.role === 'doctor';
  const isPatient = account?.role === 'patient';
  const avatarUrl = account?.userAvatar ? account.userAvatar : ``;
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg py-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/homepage')}
        >
          <img
            src="/public/logo.jpg"
            alt="BookingCare Logo"
            className="h-12 w-12 object-contain rounded-full shadow-md border-2 border-white bg-white"
          />
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
            BookingCare
          </span>
        </div>
        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate('/doctors')}
            className="text-white hover:bg-blue-800 hover:scale-105 px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-200"
          >
            Tìm bác sĩ
          </button>
          {isPatient && (
            <>
              <button
                onClick={() => navigate('/specialties')}
                className="text-white hover:bg-blue-800 hover:scale-105 px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-200"
              >
                Xem chuyên khoa
              </button>
              <button
                onClick={() => navigate('/faqs')}
                className="text-white hover:bg-blue-800 hover:scale-105 px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-200"
              >
                FAQs
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="bg-white text-blue-700 py-2 px-5 rounded-lg shadow hover:bg-blue-100 font-bold border border-blue-200 transition-all duration-200"
              >
                Lịch khám của tôi
              </button>
            </>
          )}
          {isPatient || isDoctor ? (
            <button
              onClick={() => navigate(isDoctor ? '/doctor/profile' : '/me')}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-blue-600 font-semibold cursor-pointer overflow-hidden border-2 border-blue-200 shadow hover:scale-105 transition-all"
            >
              <img
                src={avatarUrl ? `${baseUrl}${avatarUrl}` : '/DoctorLogin.png'}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <>
              <Link
                to="/"
                className="text-white hover:underline hover:opacity-80 font-semibold px-3 py-2 rounded-lg transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-700 py-2 px-5 rounded-lg shadow hover:bg-blue-100 font-bold border border-blue-200 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
