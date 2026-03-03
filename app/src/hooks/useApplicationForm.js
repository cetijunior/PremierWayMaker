import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitApplication } from '../services/api';

export function useApplicationForm(type) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', bookingDate: '' });
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

    if (!form.fullName || !form.email || !form.phone || !form.bookingDate) {
      return setError('Please fill in all fields.');
    }
    if (!cv) {
      return setError('Please upload your CV (PDF, DOC, or DOCX).');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('email', form.email);
      data.append('phone', form.phone);
      data.append('type', type);
      data.append('bookingDate', form.bookingDate);
      data.append('cv', cv);

      const result = await submitApplication(data);
      navigate('/payment', { state: { clientSecret: result.clientSecret, type } });
    } catch (err) {
      setError(err.message);
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
