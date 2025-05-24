import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/HomePage/Hero';
import FeaturedCards from '../components/HomePage/FeaturedCards';
import Recommendations from '../components/HomePage/Recommendations';
import MoreFacilities from '../components/HomePage/MoreFacilities';

function HomePage() {
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Hero />
        <FeaturedCards />
        <Recommendations />
        <MoreFacilities />
      </main>
      <div className='border-t border-gray-200 mt-8' />
      <Footer />
    </div>
  );
}

export default HomePage;
