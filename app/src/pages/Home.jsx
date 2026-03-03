import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/home/Hero';
import ServiceGrid from '../components/home/ServiceGrid';
import ApplySection from '../components/home/ApplySection';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = location.state?.scrollTo;
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      window.history.replaceState({}, '');
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <ServiceGrid />
      <ApplySection />
      <ContactSection />
    </>
  );
}
