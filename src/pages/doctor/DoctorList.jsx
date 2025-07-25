import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DoctorService from '../../services/doctor.service';

const baseUrl = 'http://localhost:5000';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.state?.search || '';

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await DoctorService.getAllDoctors();
        setDoctors(res || []);
      } catch {
        setError('Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  let filteredDoctors = doctors;
  if (search) {
    // Normalize search input and doctor names for accent insensitivity
    const normalizedSearch = search
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const searchRegex = new RegExp(normalizedSearch, 'i'); // "i" for case insensitive

    filteredDoctors = doctors.filter((doctor) =>
      searchRegex.test(
        doctor.doctorName?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      )
    );
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Danh sách bác sĩ
        </h2>
        {search && (
          <div className="text-center text-blue-600 mb-4">
            Kết quả tìm kiếm cho:{' '}
            <span className="font-semibold">{search}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Không tìm thấy bác sĩ phù hợp.
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col items-center border border-blue-100 cursor-pointer"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                <img
                  src={
                    doctor.account?.userAvatar
                      ? `${baseUrl}${doctor.account.userAvatar}`
                      : '/public/DoctorLogin.png'
                  }
                  alt={doctor.doctorName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4 shadow"
                />
                <h3 className="text-xl font-semibold text-blue-800 mb-1">
                  <span>{doctor.doctorTitle} </span> {doctor.doctorName}
                </h3>
                <p className="text-gray-600 mb-2 text-center">
                  {doctor.doctorSortDesc}
                </p>
                <div className="text-blue-600 font-bold mb-2">
                  Giá khám: {Number(doctor.examinationPrice).toLocaleString()}{' '}
                  VNĐ
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  Chuyên khoa: {doctor.specialty?.specialtyName || '-'}
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
      </div>
    </div>
  );
}

export default DoctorList;
