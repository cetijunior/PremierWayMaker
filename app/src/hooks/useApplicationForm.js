import { useState } from 'react';
import { submitApplication } from '../services/api';

export function useApplicationForm(type) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
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

    if (!form.fullName || !form.email || !form.phone) {
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
      data.append('cv', cv);

      const result = await submitApplication(data);
      window.location.href = result.url;
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
