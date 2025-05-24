import React from 'react';

function Hero() {
  return (
    <section
      className='relative bg-blue-600 py-16 flex items-center justify-center'
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='absolute inset-0 bg-blue-900 opacity-60' />
      <div className='relative z-10 container mx-auto text-center text-white'>
        <h2 className='text-4xl font-bold mb-4 drop-shadow-lg'>
          Chọn Bệnh viện - phòng khám
        </h2>
        <p className='mb-6 text-lg'>
          Đặt lịch khám nhanh chóng, dễ dàng và an toàn cùng BookingCare
        </p>
        <form className='max-w-md mx-auto flex gap-2'>
          <input
            type='text'
            placeholder='Tìm kiếm bệnh viện, phòng khám...'
            className='w-full p-3 rounded-l bg-white text-gray-900 focus:outline-none'
          />
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white px-6 rounded-r font-semibold transition'
          >
            Tìm
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
