import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getApplicationStatus } from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    getApplicationStatus(sessionId)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return <div className="text-center py-10 text-text-light">Loading...</div>;
  }

  if (!sessionId || !data) {
    return (
      <div className="text-center py-20 px-5">
        <h1 className="text-2xl font-bold text-text-light mb-2">
          Something went wrong
        </h1>
        <p className="text-text-light mb-5">
          We couldn&apos;t find your application. Please contact us for help.
        </p>
        <Link to="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-20 px-5">
      <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-4xl mx-auto mb-6">
        &#10003;
      </div>
      <h1 className="text-2xl font-bold text-text-light mb-2">
        Application Confirmed!
      </h1>
      <p className="text-text-light max-w-md mx-auto mb-2">
        Thank you, <strong>{data.fullName}</strong>. Your application for{' '}
        <strong>
          {data.type === 'inside' ? 'Inside Albania' : 'Outside Albania'}
        </strong>{' '}
        has been received.
      </p>
      <p className="text-text-light mb-4">
        Payment of <strong>&euro;{data.amount}</strong> Successful.
      </p>
      <p className="mb-2">
        Payment status: <Badge status={data.paymentStatus} />
      </p>

      <div className="bg-white inline-block px-10 py-5 rounded-lg shadow-sm mt-5">
        <p>
          <strong>Amount:</strong> &euro;{data.amount}
        </p>
        <p>
          <strong>Type:</strong>{' '}
          {data.type === 'inside' ? 'Inside Albania' : 'Outside Albania'}
        </p>
      </div>

      <p className="text-text-light mt-8 text-sm">
        A receipt and further instructions have been sent to your email. Our team
        will review your CV shortly.
      </p>

      <div className="mt-6">
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
