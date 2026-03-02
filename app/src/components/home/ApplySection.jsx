import { Link } from 'react-router-dom';
import { APPLICATION_TYPES } from '../../constants/services';
import Button from '../ui/Button';

export default function ApplySection() {
  return (
    <section className="py-16 px-5 bg-[#eae7e1]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-[#1B2A4A] mb-2">
          Apply Now
        </h2>
        <p className="text-center text-[#5A6A7A] mb-10 text-base">
          Choose the application type that matches your current location.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(APPLICATION_TYPES).map(([key, tier]) => (
            <div
              key={key}
              className="bg-white rounded-lg p-10 text-center shadow-sm border-t-4 border-[#F5B731]"
            >
              <h3 className="text-xl font-bold text-[#1e4b7a] mb-1">{tier.label}</h3>
              <p className="text-sm text-[#5A6A7A] mb-1">({tier.subtitle})</p>
              <p className="text-[#5A6A7A] mb-4 text-sm">{tier.desc}</p>
              <div className="text-3xl font-extrabold text-[#2E6B9E] mb-6">
                {tier.price}
              </div>
              <Link to={`/apply/${key}`}>
                <Button>Apply Now (Upload CV) - {tier.price}</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
