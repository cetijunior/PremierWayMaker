import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import { HiEnvelope, HiMapPin, HiPhone } from 'react-icons/hi2';
import { CONTACT } from '../../constants/brand';

const ACTIONS = [
  {
    key: 'instagram',
    Icon: FaInstagram,
    href: CONTACT.socials.instagram,
    hoverClass: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white hover:border-transparent',
  },
  {
    key: 'facebook',
    Icon: FaFacebookF,
    href: CONTACT.socials.facebook,
    hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-transparent',
  },
  {
    key: 'whatsapp',
    Icon: FaWhatsapp,
    href: CONTACT.socials.whatsapp,
    hoverClass: 'hover:bg-[#25D366] hover:text-white hover:border-transparent',
  },
  {
    key: 'email',
    Icon: HiEnvelope,
    href: `mailto:${CONTACT.email}`,
    hoverClass: 'hover:bg-blue hover:text-white hover:border-transparent',
  },
];

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative py-20 px-5 bg-cream overflow-hidden">
      {/* Subtle animated circles to continue visual language */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue/5 animate-float" />
        <div className="absolute bottom-10 right-0 w-52 h-52 rounded-full bg-gold/5 animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 border border-navy/5 rounded-full animate-spin-slow" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-3">
            {t('contact.heading')}
          </h2>
          <p className="text-text-light text-base md:text-lg">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          {ACTIONS.map(({ key, Icon, href, hoverClass }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-200 bg-white font-semibold text-navy transition-all duration-300 ${hoverClass}`}
            >
              <Icon className="w-5 h-5" />
              {t(`contact.${key}`)}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          <a href={CONTACT.address.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-navy/20 transition-all group block">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:bg-navy/10 transition-colors">
              <HiMapPin className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h4 className="text-navy font-semibold mb-1 group-hover:text-gold transition-colors">{t('contact.address_label')}</h4>
              <p className="text-text-light text-sm leading-relaxed">
                {CONTACT.address.line1}<br />
                {CONTACT.address.line2}
              </p>
            </div>
          </a>

          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
              <HiPhone className="w-5 h-5 text-navy" />
            </div>
            <div className="w-full">
              <h4 className="text-navy font-semibold mb-2">{t('contact.phone_label')}</h4>
              <div className="flex flex-col gap-3">
                {CONTACT.phones.map((phone) => (
                  <div key={phone} className="flex items-center justify-between group">
                    <span className="text-text-light text-sm font-medium">{phone}</span>
                    <div className="flex gap-2.5">
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy/60 hover:bg-gold hover:text-navy transition-all" title={t('contact.call_us')}>
                        <HiPhone className="w-4 h-4" />
                      </a>
                      <a href={CONTACT.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all" title={t('contact.whatsapp')}>
                        <FaWhatsapp className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
