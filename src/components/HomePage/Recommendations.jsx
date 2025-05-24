import React from 'react';

function Recommendations() {
  return (
    <section className='py-12 bg-gradient-to-r from-blue-50 to-blue-100 animate-fade-in'>
      <div className='container mx-auto'>
        <h2 className='text-2xl font-bold mb-4 text-blue-700'>
          Gợi ý của BookingCare
        </h2>
        <p className='text-gray-700 mb-2'>
          Dựa trên nhu cầu của bạn, chúng tôi đề xuất các cơ sở y tế uy tín và
          dịch vụ phù hợp.
        </p>
        <ul className='list-disc ml-6 text-gray-600'>
          <li>Bệnh viện đa khoa hàng đầu</li>
          <li>Phòng khám chuyên khoa chất lượng</li>
          <li>Bác sĩ giàu kinh nghiệm</li>
        </ul>
      </div>
    </section>
  );
}

export default Recommendations;
