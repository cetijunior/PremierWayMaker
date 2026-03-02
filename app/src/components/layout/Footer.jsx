import { CONTACT } from '../../constants/brand';

export default function Footer() {
  return (
    <footer className="bg-[#1B2A4A] text-[#F4F1EC]">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm leading-relaxed">
            {CONTACT.address.line1}
            <br />
            {CONTACT.address.line2}
            <br />
            {CONTACT.address.line3}
            <br />
            {CONTACT.address.line4}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          {CONTACT.phones.map((phone) => (
            <p key={phone} className="text-sm">{phone}</p>
          ))}
          <div className="flex gap-3 mt-2">
            <a
              href={CONTACT.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold hover:bg-[#f5b800] hover:text-[#1B2A4A] transition-colors"
            >
              Instagram
            </a>
            <a
              href={CONTACT.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold hover:bg-[#f5b800] hover:text-[#1B2A4A] transition-colors"
            >
              Facebook
            </a>
            <a
              href={CONTACT.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold hover:bg-[#f5b800] hover:text-[#1B2A4A] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-sm opacity-80">
        &copy; {new Date().getFullYear()} Premier Way Maker. All rights reserved.
      </div>
    </footer>
  );
}
