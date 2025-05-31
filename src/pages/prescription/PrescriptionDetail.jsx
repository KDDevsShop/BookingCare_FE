import React from 'react';

function PrescriptionDetail({ prescription, onEdit, onSendEmail, isSent }) {
  const baseUrl = 'http://localhost:5000';
  const firstPrescription = Array.isArray(prescription)
    ? prescription[0]
    : prescription;

  if (!firstPrescription) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8 border border-blue-100 mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Đơn thuốc & Kết quả khám
        </h2>
        <p className="text-center text-gray-500">Không có đơn thuốc nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8 border border-blue-100 mt-8">
      {/* <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Đơn thuốc & Kết quả khám
      </h2> */}
      {firstPrescription.prescriptionImage && (
        <img
          src={`${baseUrl}${firstPrescription.prescriptionImage}`}
          alt="Prescription"
          className="w-full rounded-lg border border-blue-200 mb-4 shadow"
        />
      )}
      {!isSent && (
        <div className="flex gap-4 mt-4 justify-center">
          <div>{!isSent}</div>
          <button
            className="py-2 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow hover:from-blue-600 hover:to-blue-800 transition"
            onClick={() => onEdit(0)}
          >
            Cập nhật đơn thuốc
          </button>
          <button
            className="py-2 px-6 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition"
            onClick={() => onSendEmail(0)}
          >
            Gửi email cho bệnh nhân
          </button>
        </div>
      )}
    </div>
  );
}

export default PrescriptionDetail;
