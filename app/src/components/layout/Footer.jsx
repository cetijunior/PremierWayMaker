import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { HiMapPin, HiPhone, HiEnvelope } from 'react-icons/hi2';
import { BRAND, CONTACT } from '../../constants/brand';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white/80">
      <div className="h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={BRAND.logo} alt="Logo" className="w-9 h-9 rounded-full ring-2 ring-gold/30" />
              <span className="text-white font-bold text-lg">{BRAND.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-white/60 hover:text-gold transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/apply/inside" className="text-sm text-white/60 hover:text-gold transition-colors">
                  {t('nav.apply')}
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-sm text-white/60 hover:text-gold transition-colors">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.contact_info')}
            </h4>
            <ul className="space-y-4">
              <li>
                 <a href={CONTACT.address.mapLink} target="_blank" rel="noopener noreferrer" title={t('contact.get_directions')} className="flex items-start gap-3 group">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                     <HiMapPin className="w-4 h-4 text-white/60 group-hover:text-gold transition-colors" />
                   </div>
                   <div className="text-sm leading-relaxed text-white/60 group-hover:text-gold transition-colors pt-1">
                     {CONTACT.address.line1}<br />
                     {CONTACT.address.line2}
                   </div>
                 </a>
              </li>
              <li>
                 <div className="flex items-start gap-3 group">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                     <HiPhone className="w-4 h-4 text-white/60" />
                   </div>
                   <div className="flex flex-col gap-2 w-full pt-1.5">
                     {CONTACT.phones.map((phone) => (
                       <div key={phone} className="flex items-center justify-between text-sm text-white/60">
                         <span>{phone}</span>
                         <div className="flex gap-2.5">
                           <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-white/40 hover:text-gold transition-colors" title={t('contact.call_us')}>
                             <HiPhone className="w-4.5 h-4.5" />
                           </a>
                           <a href={CONTACT.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#25D366] transition-colors" title={t('contact.whatsapp')}>
                             <FaWhatsapp className="w-4.5 h-4.5" />
                           </a>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
              </li>
              <li>
                 <a href={`mailto:${CONTACT.email}`} title={t('contact.message_us')} className="flex items-center gap-3 group">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                     <HiEnvelope className="w-4 h-4 text-white/60 group-hover:text-gold transition-colors" />
                   </div>
                   <span className="text-sm text-white/60 group-hover:text-gold transition-colors">
                     {CONTACT.email}
                   </span>
                 </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.follow_us')}
            </h4>
            <div className="flex gap-3">
              <a
                href={CONTACT.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4.5 h-4.5" />
              </a>
              <a
                href={CONTACT.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href={CONTACT.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 text-center py-5 text-sm text-white/40">
        {t('footer.copyright', { year })}
      </div>
    </footer>
  );
}
