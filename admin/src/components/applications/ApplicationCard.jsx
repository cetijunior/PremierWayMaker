import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ApplicationCard({ app, onDownloadCv, onDelete, isDeleting }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{app.fullName}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{app.email}</p>
        </div>
        <Badge status={app.paymentStatus} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Phone</p>
          <p className="text-slate-700 font-medium">{app.phone}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Type</p>
          <p className="text-slate-700 font-medium">{app.type === 'inside' ? 'Inside Albania' : 'Outside Albania'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Payment</p>
          <p className="text-slate-700 font-medium">€{app.amount} <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{app.paymentProvider || 'pending'}</span></p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Booking</p>
          {app.bookingStart ? (
             <div>
               <p className="text-slate-700 font-medium">{new Date(app.bookingStart).toLocaleDateString()}</p>
               <p className="text-xs text-slate-500">{new Date(app.bookingStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
          ) : (
             <p className="text-slate-700 font-medium">{app.bookingDate ? new Date(app.bookingDate).toLocaleDateString() : '—'}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Submitted: {new Date(app.createdAt).toLocaleDateString()}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownloadCv(app._id)}
            disabled={isDeleting}
            className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-medium"
          >
            Download CV
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(app._id)} disabled={isDeleting}>
            {isDeleting ? '...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
