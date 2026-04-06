import { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ApplicationRow({ app, onDownloadCv, onDelete, isDeleting }) {
  return (
    <TableRow>
      <TableCell>
        <p className="font-semibold text-slate-800">{app.fullName}</p>
      </TableCell>
      <TableCell>
        <p className="text-slate-800">{app.email}</p>
        <p className="text-xs text-slate-500">{app.phone}</p>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2 py-1 rounded object-contain text-xs font-medium bg-slate-100 text-slate-700">
          {app.type === 'inside' ? 'Inside Albania' : 'Outside Albania'}
        </span>
      </TableCell>
      <TableCell>
        <p className="font-medium text-slate-800">&euro;{app.amount}</p>
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{app.paymentProvider || 'pending'}</p>
      </TableCell>
      <TableCell>
        <Badge status={app.paymentStatus} />
      </TableCell>
      <TableCell>
        {app.bookingStart ? (
          <div className="text-sm">
            <p className="text-slate-800">{new Date(app.bookingStart).toLocaleDateString()}</p>
            <p className="text-xs text-slate-500">
              {new Date(app.bookingStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ) : app.bookingDate ? (
          <p className="text-slate-800">{new Date(app.bookingDate).toLocaleDateString()}</p>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </TableCell>
      <TableCell>
        <p className="text-slate-600">{new Date(app.createdAt).toLocaleDateString()}</p>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownloadCv(app._id)}
            disabled={isDeleting}
            className="border border-slate-200"
          >
            CV
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(app._id)} disabled={isDeleting}>
            {isDeleting ? '...' : 'Del'}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
