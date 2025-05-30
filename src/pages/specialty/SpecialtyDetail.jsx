import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpecialtyService from '../../services/specialty.service';

const baseUrl = 'http://localhost:5000';

function SpecialtyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSpecialty() {
      try {
        const res = await SpecialtyService.api.request(`/${id}`, 'GET');
        console.log(res);
        setSpecialty(res);
      } catch (err) {
        setError('Failed to fetch specialty');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchSpecialty();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!specialty) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <button
          className="mb-6 text-blue-600 hover:underline flex items-center"
          onClick={() => navigate(-1)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </button>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={
              specialty.specialtyImage
                ? `${baseUrl}${specialty.specialtyImage}`
                : '/public/DoctorLogin.png'
            }
            alt={specialty.specialtyName}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow mb-4 md:mb-0"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-800 mb-2">
              {specialty.specialtyName}
            </h2>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Mô tả:</span>{' '}
              {specialty.specialtyDesc || '-'}
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Số bác sĩ:</span>{' '}
              {specialty.doctors ? specialty.doctors.length : 0}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Danh sách bác sĩ thuộc chuyên khoa này
          </h3>
          {specialty.doctors && specialty.doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialty.doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-blue-50 rounded-xl shadow p-4 flex items-center gap-4 border border-blue-100 hover:bg-blue-100 transition cursor-pointer"
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                >
                  <img
                    src={
                      doctor.account?.userAvatar
                        ? `${baseUrl}${doctor.account.userAvatar}`
                        : `/public/DoctorLogin.png`
                    }
                    alt={doctor.doctorName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div>
                    <div className="text-lg font-semibold text-blue-800">
                      <span>{doctor.doctorTitle} </span>
                      {doctor.doctorName}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {doctor.doctorSortDesc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              Chưa có bác sĩ nào trong chuyên khoa này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecialtyDetail;
