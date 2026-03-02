import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import ServiceGrid from '../components/home/ServiceGrid';
import ApplySection from '../components/home/ApplySection';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <ServiceGrid />
      <ApplySection />
      <ContactSection />
    </>
  );
}
