function joinUrl(origin, path) {
  if (!origin) return path; // same-origin (monorepo / rewrites) or dev proxy
  return `${origin.replace(/\/+$/, '')}${path}`;
}

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || '';
const BASE_URL = joinUrl(API_ORIGIN, '/api/admin');
const REQUEST_TIMEOUT_MS = 12000;

async function withTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username, password) {
  const res = await withTimeout(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchApplications({ type, status, provider } = {}) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (status) params.set('status', status);
  if (provider) params.set('provider', provider);

  const res = await withTimeout(`${BASE_URL}/applications?${params}`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch applications');
  return data;
}

export async function deleteApplication(id) {
  const res = await withTimeout(`${BASE_URL}/applications/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete');
  return data;
}

export function getCvDownloadUrl(id) {
  const token = getToken();
  return `${BASE_URL}/applications/${id}/cv?token=${token}`;
}
