import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/api';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { saveToken } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(form.username, form.password);
      saveToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC] px-4 sm:px-5 py-6">
      <div className="w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold text-[#1B2A4A] mb-6">
          Admin Login
        </h2>
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="username" className="block font-semibold mb-1.5 text-[#1B2A4A] text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#2E6B9E]"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block font-semibold mb-1.5 text-[#1B2A4A] text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#2E6B9E]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
