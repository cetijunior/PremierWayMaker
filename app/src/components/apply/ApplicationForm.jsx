import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiUser, HiEnvelope, HiPhone } from 'react-icons/hi2';
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('form.booking_start')}
            id="bookingStartTime"
            name="bookingStartTime"
            type="time"
            value={form.bookingStartTime}
            onChange={onFieldChange}
          />
          <Input
            label={t('form.booking_end')}
            id="bookingEndTime"
            name="bookingEndTime"
            type="time"
            value={form.bookingEndTime}
            onChange={onFieldChange}
          />
        </div>
      </motion.div>

      <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
        <FileUpload onFileSelect={onFileSelect} />
      </motion.div>

      <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
        <Button type="submit" className="w-full py-3.5 text-base" disabled={loading}>
          {loading ? t('form.processing') : t('form.submit', { price: priceLabel })}
        </Button>
      </motion.div>
    </form>
  );
}
