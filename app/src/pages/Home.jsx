import Hero from '../components/home/Hero';
import ServiceGrid from '../components/home/ServiceGrid';
import ApplySection from '../components/home/ApplySection';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceGrid />
      <ApplySection />
      <ContactSection />
    </>
  );
}
