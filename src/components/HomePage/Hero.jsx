import React from 'react';

function Hero() {
  return (
    <section className='bg-gray-100 py-12'>
      <div className='container mx-auto text-center'>
        <h2 className='text-3xl font-bold mb-4'>Chọn Bệnh viện - phòng khám</h2>
        <form className='max-w-md mx-auto'>
          <input
            type='text'
            placeholder='Tìm kiếm...'
            className='w-full p-2 border rounded'
          />
          <button
            type='submit'
            className='mt-2 bg-blue-600 text-white p-2 rounded'
          >
            Tìm
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
