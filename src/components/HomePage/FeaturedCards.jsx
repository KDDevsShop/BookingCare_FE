import Card from './Card';

function FeaturedCards() {
  const cards = [
    {
      title: 'Lịch sử hình thành Bệnh viện Ung bướu Hưng Việt',
      description: 'Tìm hiểu về lịch sử của bệnh viện.',
      link: '/lich-su-benh-vien-hung-viet',
      icon: '🏥',
    },
    {
      title:
        'Cách đặt khám tại phòng khám Phục hồi chức năng, Bệnh viện Chợ Rẫy',
      description: 'Hướng dẫn đặt lịch khám.',
      link: '/huong-dan-dat-kham-choray',
      icon: '📅',
    },
    {
      title: 'Khoa Mắt Bệnh viện Chợ Rẫy nhận khám những bệnh gì?',
      description: 'Thông tin về các bệnh được điều trị tại Khoa Mắt.',
      link: '/khoa-mat-choray',
      icon: '👁️',
    },
    {
      title: 'Danh sách bác sĩ Bệnh viện Đa khoa Quốc Tế Nam Sài Gòn',
      description: 'Xem danh sách các bác sĩ tại bệnh viện.',
      link: '/danh-sach-bac-si-namsaigon',
      icon: '👨‍⚕️',
    },
  ];

  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto'>
        <h2 className='text-2xl font-bold mb-8 text-center text-blue-700'>
          Nổi bật
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              link={card.link}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCards;
