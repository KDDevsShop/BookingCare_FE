import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DoctorService from '../services/doctor.service';
import SpecialtyService from '../services/specialty.service';

function HomePage() {
  const [searchType, setSearchType] = useState('doctor');
  const [searchValue, setSearchValue] = useState('');
  const [topDoctors, setTopDoctors] = useState([]);
  const [topSpecialties, setTopSpecialties] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const doctors = await DoctorService.getAllDoctors();
        setTopDoctors(doctors ? doctors.slice(0, 3) : []);
      } catch {}
      try {
        const specialties = await SpecialtyService.getAllSpecialties();
        setTopSpecialties(specialties ? specialties.slice(0, 3) : []);
      } catch {}
    }
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'doctor') {
      navigate('/doctors', { state: { search: searchValue } });
    } else {
      navigate('/specialties', { state: { search: searchValue } });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Hero Section */}
        <section className="w-full max-w-4xl text-center mb-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            BookingCare
          </h1>
          <p className="text-lg md:text-2xl text-blue-900 mb-6 font-medium">
            Nền tảng y tế sức khỏe toàn diện - Đặt lịch khám, tìm bác sĩ, chuyên
            khoa dễ dàng
          </p>
        </section>
        {/* Search Section */}
        <section className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-10 border border-blue-100">
          <form
            className="flex flex-col md:flex-row items-center gap-4"
            onSubmit={handleSearch}
          >
            <select
              className="border border-blue-200 rounded-lg px-4 py-2 text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="doctor">Tìm bác sĩ</option>
              <option value="specialty">Tìm chuyên khoa</option>
            </select>
            <input
              type="text"
              className="flex-1 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                searchType === 'doctor'
                  ? 'Nhập tên bác sĩ...'
                  : 'Nhập tên chuyên khoa...'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              Tìm kiếm
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-6">
            <button
              className="text-blue-600 hover:underline font-semibold text-lg"
              onClick={() => navigate('/doctors')}
            >
              Xem danh sách bác sĩ
            </button>
            <button
              className="text-blue-600 hover:underline font-semibold text-lg"
              onClick={() => navigate('/specialties')}
            >
              Xem danh sách chuyên khoa
            </button>
          </div>
        </section>
        {/* Banner Section */}
        <section className="w-full bg-blue-700 py-10 flex flex-col items-center justify-center text-white mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Chào mừng đến với BookingCare!
          </h2>
          <p className="text-lg md:text-xl mb-4">
            Đặt lịch khám bệnh, tìm bác sĩ và chuyên khoa hàng đầu Việt Nam
          </p>
          <img
            src="/public/banner-healthcare.webp"
            alt="Banner"
            className="w-full max-w-lg rounded-xl shadow-lg border-4 border-blue-200"
            style={{ objectFit: 'cover' }}
          />
        </section>
        {/* List of Some Doctors Section */}
        <section className="w-full max-w-5xl mb-12">
          <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center gap-2">
            <svg
              className="w-7 h-7 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
            Một số bác sĩ nổi bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topDoctors.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Không có dữ liệu bác sĩ.
              </div>
            ) : (
              topDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col items-center border border-blue-100 cursor-pointer"
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                >
                  <img
                    src={
                      doctor.account?.userAvatar
                        ? `http://localhost:5000${doctor.account.userAvatar}`
                        : '/public/DoctorLogin.png'
                    }
                    alt={doctor.doctorName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 mb-3 shadow"
                  />
                  <h4 className="text-lg font-semibold text-blue-800 mb-1">
                    <span>{doctor.doctorTitle} </span>
                    {doctor.doctorName}
                  </h4>
                  <div className="text-gray-600 text-center text-sm mb-1">
                    {doctor.doctorSortDesc}
                  </div>
                  <div className="text-blue-600 font-bold text-sm mb-1">
                    Giá khám: {Number(doctor.examinationPrice).toLocaleString()}{' '}
                    VNĐ
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Chuyên khoa: {doctor.specialty?.specialtyName || '-'}
                  </div>
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-xs font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/doctors/${doctor.id}`);
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
        {/* List of Some Specialties Section */}
        <section className="w-full max-w-5xl mb-12">
          <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center gap-2">
            <svg
              className="w-7 h-7 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8zm0 0v2m0 4v2m-4-6a4 4 0 018 0v2"
              />
            </svg>
            Một số chuyên khoa nổi bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topSpecialties.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Không có dữ liệu chuyên khoa.
              </div>
            ) : (
              topSpecialties.map((spec) => (
                <div
                  key={spec.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col items-center border border-blue-100 cursor-pointer"
                  onClick={() => navigate(`/specialties/${spec.id}`)}
                >
                  <img
                    src={
                      spec.specialtyImage
                        ? `http://localhost:5000${spec.specialtyImage}`
                        : '/public/DoctorLogin.png'
                    }
                    alt={spec.specialtyName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 mb-3 shadow"
                  />
                  <h4 className="text-lg font-semibold text-blue-800 mb-1">
                    {spec.specialtyName}
                  </h4>
                  <div className="text-gray-600 text-center text-sm mb-1 line-clamp-2">
                    {spec.specialtyDesc}
                  </div>
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-xs font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/specialties/${spec.id}`);
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
        {/* Helpful Information Section */}
        <section className="w-full max-w-5xl mb-16">
          <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center gap-2">
            <svg
              className="w-7 h-7 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            Thông tin hữu ích
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <h4 className="text-blue-700 font-bold mb-2">
                Hướng dẫn đặt lịch khám
              </h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Đăng nhập hoặc đăng ký tài khoản.</li>
                <li>Tìm kiếm bác sĩ hoặc chuyên khoa phù hợp.</li>
                <li>Chọn bác sĩ/chuyên khoa và đặt lịch khám.</li>
                <li>Nhận xác nhận và thông báo lịch khám qua email.</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <h4 className="text-blue-700 font-bold mb-2">
                Lợi ích khi sử dụng BookingCare
              </h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Tiết kiệm thời gian, không phải xếp hàng chờ đợi.</li>
                <li>Chủ động lựa chọn bác sĩ, chuyên khoa phù hợp.</li>
                <li>Thông tin minh bạch, rõ ràng về bác sĩ và dịch vụ.</li>
                <li>Quản lý lịch sử khám bệnh dễ dàng, an toàn.</li>
              </ul>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
            <svg
              className="w-12 h-12 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Tìm bác sĩ dễ dàng
            </h3>
            <p className="text-gray-600 text-center">
              Tra cứu thông tin, lịch làm việc và đặt lịch với bác sĩ phù hợp
              chỉ với vài cú click.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
            <svg
              className="w-12 h-12 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8zm0 0v2m0 4v2m-4-6a4 4 0 018 0v2"
              />
            </svg>
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Chuyên khoa đa dạng
            </h3>
            <p className="text-gray-600 text-center">
              Khám phá các chuyên khoa, lựa chọn dịch vụ phù hợp với nhu cầu sức
              khỏe của bạn.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
            <svg
              className="w-12 h-12 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Đặt lịch nhanh chóng
            </h3>
            <p className="text-gray-600 text-center">
              Đặt lịch khám, nhận thông báo và quản lý lịch sử khám bệnh tiện
              lợi, an toàn.
            </p>
          </div>
        </section>
      </main>
      <div className="border-t border-gray-200 mt-8" />
      <Footer />
    </div>
  );
}

export default HomePage;
