import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BrandStorySection from '@/components/BrandStorySection';
import CompanyHistorySection from '@/components/CompanyHistorySection';
import MVCSection from '@/components/MVCSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen homepage-cursor">
      <Navigation />
      <HeroSection />
      <BrandStorySection />
      <CompanyHistorySection />
      <MVCSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
