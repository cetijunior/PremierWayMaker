import { BRAND } from '../../constants/brand';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#1B2A4A] to-[#2E6B9E] text-white text-center py-20 px-5">
      <img
        src={BRAND.logo}
        alt={BRAND.name}
        className="w-28 h-28 rounded-full mx-auto mb-5 border-4 border-[#F5B731]"
      />
      <h1 className="text-4xl font-bold mb-2">{BRAND.name}</h1>
      <p className="text-lg opacity-90 max-w-xl mx-auto">{BRAND.tagline}</p>
    </section>
  );
}
