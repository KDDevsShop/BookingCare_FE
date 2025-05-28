import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorService from "../../services/doctor.service";
import DoctorScheduleService from "../../services/doctorSchedule.service";
import dayjs from "dayjs";

const baseUrl = "http://localhost:5000";

function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await DoctorService.getDoctorById(id);
        setDoctor(res);
      } catch {
        setError("Không thể tải thông tin bác sĩ");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    async function fetchSchedules() {
      setScheduleLoading(true);
      try {
        const res = await DoctorScheduleService.getSchedulesByDoctorId(id);
        console.log(res);
        setSchedules(res || []);
      } catch {
        setError("Không thể tải lịch làm việc");
      } finally {
        setScheduleLoading(false);
      }
    }
    if (id) fetchSchedules();
  }, [id]);

  const filteredSchedules = filterDate
    ? schedules.filter((s) => s.workDate === filterDate)
    : schedules;

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!doctor) return null;

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
              doctor.account?.userAvatar
                ? `${baseUrl}${doctor.account.userAvatar}`
                : "/public/DoctorLogin.png"
            }
            alt={doctor.doctorName}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow mb-4 md:mb-0"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-800 mb-2">
              {doctor.doctorName}
            </h2>
            <div className="text-blue-600 font-semibold mb-2">
              Giá khám: {Number(doctor.examinationPrice).toLocaleString()} VNĐ
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Chuyên khoa:</span>{" "}
              {doctor.specialty?.specialtyName || "-"}
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Giới tính:</span>{" "}
              {doctor.account?.userGender === true ||
              doctor.account?.userGender === "true"
                ? "Nam"
                : doctor.account?.userGender === false ||
                  doctor.account?.userGender === "false"
                ? "Nữ"
                : "-"}
            </div>

            <div className="text-gray-600 mb-2">
              <span className="font-medium">Ngày sinh:</span>{" "}
              {doctor.account?.userDoB
                ? new Date(doctor.account.userDoB).toLocaleDateString()
                : "-"}
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Địa chỉ:</span>{" "}
              {doctor.account?.userAddress || "-"}
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Email:</span>{" "}
              {doctor.account?.email || "-"}
            </div>
            <div className="text-gray-600 mb-2">
              <span className="font-medium">Phương thức thanh toán:</span>{" "}
              {doctor.paymentMethods && doctor.paymentMethods.length > 0
                ? doctor.paymentMethods
                    .map((pm) => pm.paymentMethodName)
                    .join(", ")
                : "-"}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Giới thiệu
          </h3>
          <p className="text-gray-700 whitespace-pre-line bg-blue-50 rounded-lg p-4 border border-blue-100">
            {doctor.doctorDetailDesc || "Chưa có mô tả chi tiết."}
          </p>
        </div>
        {/* Doctor Schedule Section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Lịch làm việc
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <label className="font-medium text-blue-700">Lọc theo ngày:</label>
            <input
              type="date"
              className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              max={
                schedules.length > 0
                  ? schedules[schedules.length - 1].workDate
                  : undefined
              }
            />
            {filterDate && (
              <button
                className="ml-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                onClick={() => setFilterDate("")}
              >
                Xóa lọc
              </button>
            )}
          </div>
          {scheduleLoading ? (
            <div className="text-center text-blue-500 py-4">
              Đang tải lịch làm việc...
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              Không có lịch làm việc cho ngày này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-blue-50 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-blue-200 text-blue-800">
                    <th className="py-2 px-4">Ngày</th>
                    <th className="py-2 px-4">Ca làm</th>
                    <th className="py-2 px-4">Số bệnh nhân hiện tại</th>
                    <th className="py-2 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((sch) => (
                    <tr
                      key={sch.id}
                      className="border-b border-blue-100 hover:bg-blue-100 transition"
                    >
                      <td className="py-2 px-4 font-medium">{sch.workDate}</td>
                      <td className="py-2 px-4">
                        {sch.schedule?.startTime && sch.schedule?.endTime
                          ? `  ${sch.schedule?.startTime || "-"} → ${
                              sch.schedule?.endTime || "-"
                            }`
                          : "-"}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {sch.currentPatients}
                      </td>
                      <td className="py-2 px-4">
                        {sch.isAvailable ? (
                          <button
                            className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold shadow hover:bg-blue-700 transition"
                            onClick={() =>
                              navigate("/booking", {
                                state: { doctor, schedule: sch },
                              })
                            }
                          >
                            Đặt lịch
                          </button>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-xs font-semibold">
                            Đã đầy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDetail;
