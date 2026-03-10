import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitApplication } from '../services/api';

export function useApplicationForm(type) {
  const navigate = useNavigate();
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
        const dayOfWeek = bookingDateObj.getDay(); // 0 = Sunday, 6 = Saturday

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setError(
            'Bookings are only available Monday–Friday between 08:00 and 18:00 (Tirana local time).'
          );
          setForm((prev) => ({ ...prev, bookingDate: '' }));
          return;
        }
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(file) {
    setCv(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.bookingDate ||
      !form.bookingStartTime ||
      !form.bookingEndTime
    ) {
      return setError('Please fill in all fields.');
    }
    if (!cv) {
      return setError('Please upload your CV (PDF, DOC, or DOCX).');
    }

    // Basic weekday and business-hours checks in browser local time
    const bookingDateObj = new Date(`${form.bookingDate}T00:00`);

    if (Number.isNaN(bookingDateObj.getTime())) {
      return setError('Invalid booking date. Please check your selected date.');
    }

    const dayOfWeek = bookingDateObj.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return setError(
        'Bookings are only available Monday–Friday between 08:00 and 18:00 (Tirana local time).'
      );
    }

    const [startHourStr, startMinuteStr] = form.bookingStartTime.split(':');
    const [endHourStr, endMinuteStr] = form.bookingEndTime.split(':');

    const startHour = Number(startHourStr);
    const startMinute = Number(startMinuteStr);
    const endHour = Number(endHourStr);
    const endMinute = Number(endMinuteStr);

    if (
      Number.isNaN(startHour) ||
      Number.isNaN(startMinute) ||
      Number.isNaN(endHour) ||
      Number.isNaN(endMinute)
    ) {
      return setError('Invalid booking time. Please check your selected time.');
    }

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const openMinutes = 8 * 60; // 08:00
    const closeMinutes = 18 * 60; // 18:00

    if (
      startTotalMinutes < openMinutes ||
      startTotalMinutes >= closeMinutes ||
      endTotalMinutes <= openMinutes ||
      endTotalMinutes > closeMinutes
    ) {
      return setError(
        'Bookings are only available Monday–Friday between 08:00 and 18:00 (Tirana local time).'
      );
    }

    if (endTotalMinutes <= startTotalMinutes) {
      return setError('End time must be after start time.');
    }

    // Build start/end ISO strings from date + time inputs.
    const startIso = new Date(`${form.bookingDate}T${form.bookingStartTime}`).toISOString();
    const endIso = new Date(`${form.bookingDate}T${form.bookingEndTime}`).toISOString();

    if (Number.isNaN(new Date(startIso).getTime()) || Number.isNaN(new Date(endIso).getTime())) {
      return setError('Invalid booking time. Please check your selected time.');
    }

    if (new Date(startIso) >= new Date(endIso)) {
      return setError('End time must be after start time.');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('email', form.email);
      data.append('phone', form.phone);
      data.append('type', type);
      data.append('bookingStart', startIso);
      data.append('bookingEnd', endIso);
      data.append('cv', cv);

      await submitApplication(data);

      // Temporary: bypass payment and go directly to success page.
      navigate('/success', {
        state: {
          fullName: form.fullName,
          type,
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
