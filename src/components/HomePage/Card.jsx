function Card({ title, description, link, icon }) {
  return (
    <div className='border p-6 rounded-lg shadow hover:shadow-lg transition bg-white flex flex-col gap-2 group'>
      <div className='text-3xl mb-2'>{icon}</div>
      <h3 className='text-lg font-semibold group-hover:text-blue-600 transition'>
        {title}
      </h3>
      <p className='text-gray-600 flex-1'>{description}</p>
      <a href={link} className='text-blue-600 hover:underline font-medium mt-2'>
        Xem thêm &rarr;
      </a>
    </div>
  );
}
export default Card;
