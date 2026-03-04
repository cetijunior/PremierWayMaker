import { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ApplicationRow({ app, onDownloadCv, onDelete, isDemo }) {
  return (
    <TableRow>
      <TableCell>{app.fullName}</TableCell>
      <TableCell>{app.email}</TableCell>
      <TableCell>{app.phone}</TableCell>
      <TableCell>{app.type === 'inside' ? 'Inside' : 'Outside'}</TableCell>
      <TableCell>&euro;{app.amount}</TableCell>
      <TableCell>
        <Badge status={app.paymentStatus} />
      </TableCell>
      <TableCell>
        {app.bookingDate ? new Date(app.bookingDate).toLocaleDateString() : '—'}
      </TableCell>
      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex gap-1.5 flex-wrap">
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
      </TableCell>
    </TableRow>
  );
}
