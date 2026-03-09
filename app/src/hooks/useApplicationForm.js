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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
