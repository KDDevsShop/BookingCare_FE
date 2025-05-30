import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SpecialtyService from '../../services/specialty.service';

const baseUrl = 'http://localhost:5000';

function SpecialtyListPatient() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.state?.search || '';

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const res = await SpecialtyService.getAllSpecialties();
        setSpecialties(res || []);
      } catch {
        setError('Failed to fetch specialties');
      } finally {
        setLoading(false);
      }
    }
    fetchSpecialties();
  }, []);

  let filteredSpecialties = specialties;
  if (search) {
    const normalizedSearch = search
      .toLowerCase()
      .normalize('NFD') // splits accented characters into base + diacritic
      .replace(/[\u0300-\u036f]/g, ''); // removes diacritics

    filteredSpecialties = specialties.filter((spec) => {
      const normalizedSpecName = spec.specialtyName
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalizedSpecName?.includes(normalizedSearch);
    });
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Danh sách chuyên khoa
        </h2>
        {search && (
          <div className="text-center text-blue-600 mb-4">
            Kết quả tìm kiếm cho:{' '}
            <span className="font-semibold">{search}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpecialties.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Không tìm thấy chuyên khoa phù hợp.
            </div>
          ) : (
            filteredSpecialties.map((spec) => (
              <div
                key={spec.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col items-center border border-blue-100 cursor-pointer"
                onClick={() => navigate(`/specialties/${spec.id}`)}
              >
                <img
                  src={
                    spec.specialtyImage
                      ? `${baseUrl}${spec.specialtyImage}`
                      : '/public/DoctorLogin.png'
                  }
                  alt={spec.specialtyName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4 shadow"
                />
                <h3 className="text-xl font-semibold text-blue-800 mb-1">
                  {spec.specialtyName}
                </h3>
                <p className="text-gray-600 mb-2 text-center line-clamp-3">
                  {spec.specialtyDesc}
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
      </div>
    </div>
  );
}

export default SpecialtyListPatient;
