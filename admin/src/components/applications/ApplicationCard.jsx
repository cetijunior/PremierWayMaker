import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ApplicationCard({ app, onDownloadCv, onDelete, isDemo }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <h3 className="font-semibold text-[#1B2A4A]">{app.fullName}</h3>
        <Badge status={app.paymentStatus} />
      </div>
      <dl className="grid grid-cols-1 gap-1.5 text-sm text-text-light">
        <div>
          <span className="font-medium text-[#1B2A4A]">Email:</span> {app.email}
        </div>
        <div>
          <span className="font-medium text-[#1B2A4A]">Phone:</span> {app.phone}
        </div>
        <div>
          <span className="font-medium text-[#1B2A4A]">Type:</span> {app.type === 'inside' ? 'Inside' : 'Outside'}
        </div>
        <div>
          <span className="font-medium text-[#1B2A4A]">Amount:</span> €{app.amount}
        </div>
        <div>
          <span className="font-medium text-[#1B2A4A]">Booking:</span>{' '}
          {app.bookingStart
            ? new Date(app.bookingStart).toLocaleString()
            : app.bookingDate
            ? new Date(app.bookingDate).toLocaleDateString()
            : '—'}
        </div>
        <div>
          <span className="font-medium text-[#1B2A4A]">Submitted:</span> {new Date(app.createdAt).toLocaleDateString()}
        </div>
      </dl>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onDownloadCv(app._id)}
          disabled={isDemo}
        >
          CV
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(app._id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
