import Input from '../ui/Input';
import Button from '../ui/Button';
import FileUpload from './FileUpload';

export default function ApplicationForm({
  form,
  error,
  loading,
  priceLabel,
  onFieldChange,
  onFileSelect,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        id="fullName"
        name="fullName"
        type="text"
        value={form.fullName}
        onChange={onFieldChange}
        placeholder="Your full name"
      />

      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        value={form.email}
        onChange={onFieldChange}
        placeholder="you@example.com"
      />

      <Input
        label="Phone Number"
        id="phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={onFieldChange}
        placeholder="+355 69 123 4567"
      />

      <FileUpload onFileSelect={onFileSelect} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : `Pay ${priceLabel} & Submit`}
      </Button>
    </form>
  );
}
