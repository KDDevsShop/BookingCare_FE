function Card({ title, description, link }) {
  return (
    <div className='border p-4 rounded shadow'>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p>{description}</p>
      <a href={link} className='text-blue-600 hover:underline'>
        Xem thêm
      </a>
    </div>
  );
}
export default Card;
