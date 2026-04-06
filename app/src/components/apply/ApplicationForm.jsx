import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiUser, HiEnvelope, HiPhone, HiCalendarDays, HiClock } from 'react-icons/hi2';
import Input from '../ui/Input';
import DatePicker from '../ui/DatePicker';
import Button from '../ui/Button';
import FileUpload from './FileUpload';

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const BUSINESS_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export default function ApplicationForm({
  form,
  error,
  loading,
  priceLabel,
  onFieldChange,
  onFileSelect,
  onSubmit,
}) {
  const { t } = useTranslation();

  const handleSlotChange = (e) => {
    const value = e.target.value;

    if (!value) {
      onFieldChange({
        target: { name: 'bookingStartTime', value: '' },
      });
      onFieldChange({
        target: { name: 'bookingEndTime', value: '' },
      });
      return;
    }

    const [hourStr, minuteStr] = value.split(':');
    const startHour = Number(hourStr);
    const startMinute = Number(minuteStr);

    const endHour = startHour + 1;
    const pad = (n) => (n < 10 ? `0${n}` : String(n));
    const start = `${pad(startHour)}:${pad(startMinute)}`;
    const end = `${pad(endHour)}:${pad(startMinute)}`;

    onFieldChange({
      target: { name: 'bookingStartTime', value: start },
    });
    onFieldChange({
      target: { name: 'bookingEndTime', value: end },
    });
  };

  const selectedSlot = form.bookingStartTime || '';

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-8">
        <section>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-text-light mb-2">
            {t('form.step1_label')}
          </p>
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-blue text-sm font-semibold">
              1
            </span>
            {t('form.step1_title')}
          </h3>

          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <Input
              label={t('form.full_name')}
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={onFieldChange}
              placeholder={t('form.full_name_placeholder')}
              icon={<HiUser className="w-5 h-5" />}
            />
          </motion.div>

          <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
            <Input
              label={t('form.email')}
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onFieldChange}
              placeholder={t('form.email_placeholder')}
              icon={<HiEnvelope className="w-5 h-5" />}
            />
          </motion.div>

          <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
            <Input
              label={t('form.phone')}
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onFieldChange}
              placeholder={t('form.phone_placeholder')}
              icon={<HiPhone className="w-5 h-5" />}
            />
          </motion.div>
        </section>

        <section className="pt-1 border-t border-dashed border-gray-200">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-text-light mb-2">
            {t('form.step2_label')}
          </p>
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-blue text-sm font-semibold">
              2
            </span>
            {t('form.step2_title')}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
              <DatePicker
                label={t('form.booking_date')}
                id="bookingDate"
                name="bookingDate"
                value={form.bookingDate}
                onChange={onFieldChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
              <div>
                <label
                  htmlFor="bookingSlot"
                  className="block text-sm font-semibold text-navy mb-1.5 tracking-wide"
                >
                  <span className="inline-flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-blue" />
                    {t('form.booking_start')} – {t('form.booking_end')}
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="bookingSlot"
                    name="bookingSlot"
                    value={selectedSlot}
                    onChange={handleSlotChange}
                    className="w-full px-4 py-3 bg-cream/60 border-2 border-gray-200 rounded-xl text-base text-navy placeholder:text-text-light/50 transition-all duration-200 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 focus:bg-white appearance-none"
                  >
                    <option value="">
                      {t('form.booking_slot_placeholder')}
                    </option>
                    {BUSINESS_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}–{String(Number(slot.split(':')[0]) + 1).padStart(2, '0')}:
                        {slot.split(':')[1]}
                      </option>
                    ))}
                  </select>
                  <HiCalendarDays className="w-5 h-5 text-text-light absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-xs text-text-light mt-2 flex items-start gap-2">
                  <HiClock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    {t('form.booking_slot_hint')}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pt-1 border-t border-dashed border-gray-200">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-text-light mb-2">
            {t('form.step3_label')}
          </p>
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-blue text-sm font-semibold">
              3
            </span>
            {t('form.step3_title')}
          </h3>

          <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
            <FileUpload onFileSelect={onFileSelect} />
          </motion.div>

          <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
            <Button type="submit" className="w-full py-3.5 text-base mt-3" disabled={loading}>
              {loading ? t('form.processing') : t('form.submit', { price: priceLabel })}
            </Button>
            <p className="mt-3 text-[10px] sm:text-xs text-text-light/70 text-center leading-relaxed">
              {t('form.payment_reminder')}
            </p>
          </motion.div>
        </section>
      </div>
    </form>
  );
}
