import { useParams, Link } from 'react-router-dom';
import { APPLICATION_TYPES } from '../constants/services';
import { useApplicationForm } from '../hooks/useApplicationForm';
import ApplicationForm from '../components/apply/ApplicationForm';
import Button from '../components/ui/Button';

export default function Apply() {
  const { type } = useParams();
  const config = APPLICATION_TYPES[type];
  const {
    form,
    error,
    loading,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useApplicationForm(type);

  if (!config) {
    return (
      <div className="max-w-lg mx-auto py-10 px-5 text-center">
        <h2 className="text-2xl font-bold text-[#1B2A4A] mb-4">
          Invalid application type
        </h2>
        <Link to="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-5">
      <h2 className="text-center text-2xl font-bold text-[#1B2A4A] mb-1">
        Apply — {config.label}
      </h2>
      <p className="text-center text-xl font-bold text-blue mb-8">
        Application Fee: {config.price}
      </p>

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <ApplicationForm
          form={form}
          error={error}
          loading={loading}
          priceLabel={config.price}
          onFieldChange={handleChange}
          onFileSelect={handleFileChange}
          onSubmit={handleSubmit}
        />
      </div>

      <p className="text-center mt-5">
        <Link to="/" className="text-blue hover:underline">
          &larr; Back to Home
        </Link>
      </p>
    </div>
  );
}
