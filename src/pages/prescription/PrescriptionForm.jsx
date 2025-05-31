import React, { useState } from 'react';
import html2canvas from 'html2canvas-pro';

function PrescriptionForm({ booking, doctor, onSubmit, initialData }) {
  const [result, setResult] = useState(initialData?.result || '');
  const [medicine, setMedicine] = useState(initialData?.medicine || '');
  const [usage, setUsage] = useState(initialData?.usage || '');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    try {
      // Wait for the preview to render before capturing

      await new Promise((resolve) => setTimeout(resolve, 100));
      const node = document.getElementById('prescription-preview');
      if (!node) {
        setError('Không tìm thấy khung đơn thuốc để tạo ảnh');
        setGenerating(false);
        return;
      }

      const canvas = await html2canvas(node, {
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      console.log(canvas);
      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to generate image');
          setGenerating(false);
          return;
        }

        // Wrap the Blob in a File if you want to give it a name
        const file = new File([blob], 'prescription.png', {
          type: 'image/png',
        });

        // Then you can submit this File to your API:
        onSubmit(file);

        setGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error(error);
      setError('Error generating prescription image');
      setGenerating(false);
    }
  }

  // Preview for image generation
  const now = new Date();
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8 border border-blue-100 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Tạo đơn thuốc & kết quả khám
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-blue-700 mb-1">
            Kết quả khám
          </label>
          <textarea
            className="w-full border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            required
            rows={3}
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-700 mb-1">
            Thuốc
          </label>
          <input
            className="w-full border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-700 mb-1">
            Cách dùng
          </label>
          <input
            className="w-full border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={generating}
        >
          {generating ? 'Đang tạo đơn thuốc...' : 'Tạo đơn thuốc'}
        </button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
      {/* Hidden preview for image generation */}
      <div
        id="prescription-preview"
        className="p-6 bg-blue-50 rounded-lg mt-8"
        style={{
          width: 400,
          display: 'block',
          position: 'absolute',
          left: '-9999px',
          top: 0,
        }}
      >
        <h2 className="text-xl font-bold text-blue-800 mb-2 text-center">
          ĐƠN THUỐC & KẾT QUẢ KHÁM
        </h2>
        <div className="text-sm text-blue-700 mb-1">
          Thời gian: {now.toLocaleString('vi-VN')}
        </div>
        <div className="text-sm text-blue-700 mb-1">
          Bác sĩ: {doctor?.doctorName}
        </div>
        <div className="text-sm text-blue-700 mb-1">
          Bệnh nhân: {booking?.patient?.patientName}
        </div>
        <div className="text-sm text-blue-700 mb-1">
          Email: {booking?.patient?.patientEmail}
        </div>
        <div className="mt-2 text-gray-700">
          <span className="font-semibold">Kết quả khám:</span> {result}
        </div>
        <div className="mt-2 text-gray-700">
          <span className="font-semibold">Thuốc:</span> {medicine}
        </div>
        <div className="mt-2 text-gray-700">
          <span className="font-semibold">Cách dùng:</span> {usage}
        </div>
      </div>
    </div>
  );
}

export default PrescriptionForm;
