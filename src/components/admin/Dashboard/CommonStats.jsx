const CommonStats = ({ stats }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {stats?.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg shadow-md text-white items-center gap-4 ${
            index === 0
              ? 'bg-blue-500'
              : index === 1
              ? 'bg-green-500'
              : 'bg-purple-500'
          } hover:scale-105 transition-transform duration-300`}
        >
          <div className='text-2xl md:text-xl flex justify-start items-center gap-1 mb-4'>
            {stat?.icon}
            <h3 className='font-semibold'>{stat?.title || 'N/A'}</h3>
          </div>
          <div>
            <p className='text-3xl'>{stat?.value || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommonStats;
