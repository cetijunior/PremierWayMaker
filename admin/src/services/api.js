const BASE_URL = '/api/admin';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchApplications({ type, status } = {}) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (status) params.set('status', status);

  const res = await fetch(`${BASE_URL}/applications?${params}`, {
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
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
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
