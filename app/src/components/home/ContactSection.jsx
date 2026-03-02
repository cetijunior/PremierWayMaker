import { CONTACT } from '../../constants/brand';

export default function ContactSection() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-[#1B2A4A] mb-2">
          Contact Us
        </h2>
        <p className="text-center text-[#5A6A7A] mb-10 text-base">
          Reach out to us anytime — we&apos;re here to help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <h4 className="text-[#1B2A4A] font-semibold mb-1.5">Address</h4>
            <p className="text-[#5A6A7A] text-sm leading-relaxed">
              {CONTACT.address.line1}
              <br />
              {CONTACT.address.line2}
              <br />
              {CONTACT.address.line3}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-[#1B2A4A] font-semibold mb-1.5">Phone</h4>
            {CONTACT.phones.map((phone) => (
              <p key={phone} className="text-[#5A6A7A] text-sm">
                {phone}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
