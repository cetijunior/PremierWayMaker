import { SERVICES } from '../../constants/services';
import ServiceCard from './ServiceCard';

export default function ServiceGrid() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-[#1B2A4A] mb-2">
          What We Offer
        </h2>
        <p className="text-center text-[#5A6A7A] mb-10 text-base">
          We specialize in placing skilled workers in high-demand sectors across Albania and abroad.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
