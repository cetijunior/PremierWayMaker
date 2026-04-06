import Select from '../ui/Select';

const TYPE_OPTIONS = [
  { value: 'inside', label: 'Inside Albania' },
  { value: 'outside', label: 'Outside Albania' },
];

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const PROVIDER_OPTIONS = [
  { value: 'paypal', label: 'PayPal' },
  { value: 'stripe', label: 'Stripe' },
];

export default function ApplicationFilters({
  filterType,
  filterStatus,
  filterProvider,
  onTypeChange,
  onStatusChange,
  onProviderChange,
  onClear,
  hasFilters,
}) {
  return (
    <div className="flex gap-2 sm:gap-3 flex-wrap mb-4 sm:mb-5 items-center">
      <Select
        value={filterType}
        onChange={(e) => onTypeChange(e.target.value)}
        options={TYPE_OPTIONS}
        placeholder="All Types"
      />
      <Select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        options={STATUS_OPTIONS}
        placeholder="All Statuses"
      />
      <Select
        value={filterProvider}
        onChange={(e) => onProviderChange(e.target.value)}
        options={PROVIDER_OPTIONS}
        placeholder="All Providers"
      />
      <button
        type="button"
        onClick={onClear}
        disabled={!hasFilters}
        className="rounded-lg border border-slate-200 bg-white px-3 py-[9px] text-sm font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
