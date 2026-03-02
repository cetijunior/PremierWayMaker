const COLORS = {
  paid: 'bg-green-50 text-green-700 ring-green-200',
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
};

export default function Badge({ status }) {
  return (
    <span
      className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ring-1 ${COLORS[status] || 'bg-gray-50 text-gray-700 ring-gray-200'}`}
    >
      {status}
    </span>
  );
}
