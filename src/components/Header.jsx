import React from 'react';

function Header() {
  return (
    <header className='bg-blue-600 text-white p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>
          BookingCare - Nền tảng y tế sức khỏe toàn diện
        </h1>
        <p className='text-lg'>Hỏi nhanh, đáp chuẩn - Đặt khám dễ dàng</p>
      </div>
    </header>
  );
}

export default Header;
