import React from 'react';
import { Link } from 'react-router-dom';
import { ToVietnamCurrencyFormat } from '../../../utils/ToVietnamCurrencyFormat';

const BASE_URL = 'http://localhost:5000/';

const defaultAvatar = '/public/DoctorLogin.png';

const TopStatsSection = ({ patients = [], topDoctors = [], doctors = [] }) => {
  const ref = React.useRef(null);

  const handleScroll = () => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-8'>
        {/* Top VIP Patients Table */}
        <div className='bg-white rounded-lg shadow-md p-6 overflow-x-auto'>
          <h3 className='text-xl font-bold mb-4 text-blue-700'>
            Top VIP Bệnh nhân
          </h3>
          {!Array.isArray(patients) || patients.length === 0 ? (
            <div className='text-center my-20 italic text-gray-600'>
              Không có dữ liệu
            </div>
          ) : (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    #
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Avatar
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Tên bệnh nhân
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Tổng chi tiêu
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, idx) => (
                  <tr
                    key={patient.patientId}
                    className='hover:bg-blue-50 transition'
                  >
                    <td className='px-4 py-2'>{idx + 1}</td>
                    <td className='px-4 py-2'>
                      <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center'>
                        <img
                          src={
                            patient.avatar
                              ? BASE_URL + patient.avatar.replace(/\\/g, '/')
                              : defaultAvatar
                          }
                          alt={patient.patientName}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </td>
                    <td className='px-4 py-2 font-medium'>
                      {patient.patientName}
                    </td>
                    <td className='px-4 py-2'>
                      {ToVietnamCurrencyFormat(patient.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Excellent Doctors Table */}
        <div className='bg-white rounded-lg shadow-md p-6 overflow-x-auto'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-bold text-blue-700'>
              Top Bác sĩ xuất sắc
            </h3>
            <button
              onClick={handleScroll}
              className='text-blue-600 hover:underline font-medium text-sm cursor-pointer hover:text-blue-500'
            >
              Xem chi tiết
            </button>
          </div>
          {!Array.isArray(topDoctors) || topDoctors.length === 0 ? (
            <div className='text-center my-20 italic text-gray-600'>
              Không có dữ liệu
            </div>
          ) : (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    #
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Avatar
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Tên bác sĩ
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Lượt khám
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody>
                {topDoctors.map((doctor, idx) => (
                  <tr
                    key={doctor.doctorId}
                    className='hover:bg-blue-50 transition'
                  >
                    <td className='px-4 py-2'>{idx + 1}</td>
                    <td className='px-4 py-2'>
                      <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center'>
                        <img
                          src={
                            doctor.avatar
                              ? BASE_URL + doctor.avatar.replace(/\\/g, '/')
                              : defaultAvatar
                          }
                          alt={doctor.doctorName}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </td>
                    <td className='px-4 py-2 font-medium'>
                      {doctor.doctorName}
                    </td>
                    <td className='px-4 py-2'>
                      {doctor.totalCompleteBookings}
                    </td>
                    <td className='px-4 py-2'>
                      {ToVietnamCurrencyFormat(doctor.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        ref={ref}
        className='mt-10 bg-white rounded-lg shadow-md p-6 overflow-x-auto'
      >
        <h3 className='text-xl font-bold mb-4 text-blue-700'>
          Doanh thu & lượt khám của tất cả bác sĩ
        </h3>
        {!Array.isArray(doctors) || doctors.length === 0 ? (
          <div className='text-center my-20 italic text-gray-600'>
            Không có dữ liệu
          </div>
        ) : (
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                  #
                </th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                  Avatar
                </th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                  Tên bác sĩ
                </th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                  Lượt khám
                </th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, idx) => (
                <tr
                  key={doctor.doctorId}
                  className='hover:bg-blue-50 transition'
                >
                  <td className='px-4 py-2'>{idx + 1}</td>
                  <td className='px-4 py-2'>
                    <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center'>
                      <img
                        src={
                          doctor.avatar
                            ? BASE_URL + doctor.avatar.replace(/\\/g, '/')
                            : defaultAvatar
                        }
                        alt={doctor.doctorName}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </td>
                  <td className='px-4 py-2 font-medium'>{doctor.doctorName}</td>
                  <td className='px-4 py-2'>{doctor.totalCompleteBookings}</td>
                  <td className='px-4 py-2'>
                    {ToVietnamCurrencyFormat(doctor.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TopStatsSection;
