const COLORS = {
  paid: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  pending: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  failed: 'bg-rose-100 text-rose-800 ring-rose-600/20',
};

export default function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${COLORS[status] || 'bg-slate-100 text-slate-800 ring-slate-500/20'}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
    </span>
  );
}
