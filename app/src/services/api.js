const BASE_URL = '/api';

export async function submitApplication(formData) {
  const res = await fetch(`${BASE_URL}/apply`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export async function confirmPayPalPayment(orderId) {
  const res = await fetch(`${BASE_URL}/apply/paypal/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not confirm PayPal payment');
  return data;
}

export async function getApplicationStatus(sessionId) {
  const res = await fetch(`${BASE_URL}/apply/status/${sessionId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Application not found');
  return data;
}
