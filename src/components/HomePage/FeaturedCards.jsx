import Card from './Card';

function FeaturedCards() {
  const cards = [
    {
      title: 'Lịch sử hình thành Bệnh viện Ung bướu Hưng Việt',
      description: 'Tìm hiểu về lịch sử của bệnh viện.',
      link: '/lich-su-benh-vien-hung-viet',
    },
    {
      title:
        'Cách đặt khám tại phòng khám Phục hồi chức năng, Bệnh viện Chợ Rẫy',
      description: 'Hướng dẫn đặt lịch khám.',
      link: '/huong-dan-dat-kham-choray',
    },
    {
      title: 'Khoa Mắt Bệnh viện Chợ Rẫy nhận khám những bệnh gì?',
      description: 'Thông tin về các bệnh được điều trị tại Khoa Mắt.',
      link: '/khoa-mat-choray',
    },
    {
      title: 'Danh sách bác sĩ Bệnh viện Đa khoa Quốc Tế Nam Sài Gòn',
      description: 'Xem danh sách các bác sĩ tại bệnh viện.',
      link: '/danh-sach-bac-si-namsaigon',
    },
  ];

  return (
    <section className='py-8'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedCards;
