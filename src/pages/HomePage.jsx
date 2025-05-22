import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/HomePage/Hero';
import FeaturedCards from '../components/HomePage/FeaturedCards';
import Recommendations from '../components/HomePage/Recommendations';
import MoreFacilities from '../components/HomePage/MoreFacilities';

function HomePage() {
  return (
    <div>
      <Header />
      <Hero />
      <FeaturedCards />
      <Recommendations />
      <MoreFacilities />
      <Footer />
    </div>
  );
}

export default HomePage;
