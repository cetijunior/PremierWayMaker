const COLORS = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

export default function Badge({ status }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${COLORS[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
}
