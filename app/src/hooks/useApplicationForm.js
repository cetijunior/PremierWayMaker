// app/src/hooks/useApplicationForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { submitApplication } from '../services/api';

export function useApplicationForm(type) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    bookingDate: '',
    bookingStartTime: '',
    bookingEndTime: '',
  });
  const [cv, setCv] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'bookingDate') {
      const bookingDateObj = new Date(`${value}T00:00`);
      if (!Number.isNaN(bookingDateObj.getTime())) {
        const dayOfWeek = bookingDateObj.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setError(t('form.error_weekday_only'));
          setForm((prev) => ({ ...prev, bookingDate: '' }));
          return;
        }
      }
    }

    setError('');
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(file) {
    setCv(file);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // --- Client-side validation ---
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.bookingDate ||
      !form.bookingStartTime ||
      !form.bookingEndTime
    ) {
      return setError(t('form.error_fill_all_fields'));
    }
    if (!cv) {
      return setError(t('form.error_upload_cv'));
    }

    const bookingDateObj = new Date(`${form.bookingDate}T00:00`);
    if (Number.isNaN(bookingDateObj.getTime())) {
      return setError(t('form.error_invalid_booking_date'));
    }

    const dayOfWeek = bookingDateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return setError(t('form.error_weekday_only'));
    }

    const [startHour, startMinute] = form.bookingStartTime.split(':').map(Number);
    const [endHour, endMinute]     = form.bookingEndTime.split(':').map(Number);

    if (
      [startHour, startMinute, endHour, endMinute].some((n) => Number.isNaN(n))
    ) {
      return setError(t('form.error_invalid_booking_time'));
    }

    const startTotal = startHour * 60 + startMinute;
    const endTotal   = endHour   * 60 + endMinute;
    const OPEN  = 8  * 60;
    const CLOSE = 18 * 60;

    if (startTotal < OPEN || startTotal >= CLOSE || endTotal <= OPEN || endTotal > CLOSE) {
      return setError(t('form.error_weekday_only'));
    }
    if (endTotal <= startTotal) {
      return setError(t('form.error_end_after_start'));
    }

    const startIso = new Date(`${form.bookingDate}T${form.bookingStartTime}`).toISOString();
    const endIso   = new Date(`${form.bookingDate}T${form.bookingEndTime}`).toISOString();

    if (
      Number.isNaN(new Date(startIso).getTime()) ||
      Number.isNaN(new Date(endIso).getTime())
    ) {
      return setError(t('form.error_invalid_booking_time'));
    }

    // --- Submit to API ---
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName',     form.fullName);
      formData.append('email',        form.email);
      formData.append('phone',        form.phone);
      formData.append('type',         type);
      formData.append('bookingStart', startIso);
      formData.append('bookingEnd',   endIso);
      formData.append('cv',           cv);

      // POST /api/apply — saves application as 'pending', returns applicationId
      const data = await submitApplication(formData);

      const PRICES = { inside: 50, outside: 300 };

      // Navigate to /payment with everything the PayPal page needs
      navigate('/payment', {
        state: {
          applicationId: data.applicationId,
          type,
          fullName: form.fullName,
          amount: PRICES[type],
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    cv,
    error,
    loading,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
}
