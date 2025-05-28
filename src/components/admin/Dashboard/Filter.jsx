import React from 'react';

function Filter({ timeFilter, setTimeFilter, selectedTime, setSelectedTime }) {
  const years = React.useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: new Date().getFullYear() - i,
        label: `${new Date().getFullYear() - i}`,
      })),
    []
  );

  const months = React.useMemo(
    () => [
      { value: '01', label: 'Tháng 1' },
      { value: '02', label: 'Tháng 2' },
      { value: '03', label: 'Tháng 3' },
      { value: '04', label: 'Tháng 4' },
      { value: '05', label: 'Tháng 5' },
      { value: '06', label: 'Tháng 6' },
      { value: '07', label: 'Tháng 7' },
      { value: '08', label: 'Tháng 8' },
      { value: '09', label: 'Tháng 9' },
      { value: '10', label: 'Tháng 10' },
      { value: '11', label: 'Tháng 11' },
      { value: '12', label: 'Tháng 12' },
    ],
    []
  );

  const handleTimeFilterChange = (e) => {
    const newFilter = e.target.value;
    console.log(newFilter);
    setTimeFilter(newFilter);
    setSelectedTime(
      newFilter === 'by-month' ? months[0].value : years[0].value
    );
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
      <h2 className='italic mb-4 text-gray-600'>
        Chọn một một loại bộ lọc và bạn có thể xem thống kê theo từng thời kỳ
      </h2>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Loại thống kê
          </label>
          <select
            value={timeFilter}
            onChange={handleTimeFilterChange}
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='by-month'>Thống kê theo tháng</option>
            <option value='by-year'>Thống kê theo năm</option>
          </select>
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Thời gian
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {(timeFilter === 'by-month' ? months : years)?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filter;
