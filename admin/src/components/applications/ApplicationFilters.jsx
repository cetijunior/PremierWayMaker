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

export default function ApplicationFilters({
  filterType,
  filterStatus,
  onTypeChange,
  onStatusChange,
}) {
  return (
    <div className="flex gap-2 sm:gap-3 flex-wrap mb-4 sm:mb-5">
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
    </div>
  );
}
