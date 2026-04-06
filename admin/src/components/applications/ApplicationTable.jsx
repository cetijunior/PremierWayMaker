import { Table, TableHead, TableHeader, TableBody } from '../ui/Table';
import ApplicationRow from './ApplicationRow';
import ApplicationCard from './ApplicationCard';

const COLUMNS = ['Name', 'Contact', 'Type', 'Amount', 'Status', 'Booking', 'Submitted', 'Actions'];

export default function ApplicationTable({ applications, onDownloadCv, onDelete, deletingIds }) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-lg font-medium">No applications found.</p>
        <p className="text-sm mt-1">Try adjusting your filters or wait for new submissions.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden xl:block">
        <Table>
          <TableHead>
            {COLUMNS.map((col) => (
              <TableHeader key={col}>{col}</TableHeader>
            ))}
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <ApplicationRow
                key={app._id}
                app={app}
                onDownloadCv={onDownloadCv}
                onDelete={onDelete}
                isDeleting={deletingIds.includes(app._id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="xl:hidden p-4 sm:p-5 space-y-4 bg-slate-50">
        {applications.map((app) => (
          <ApplicationCard
            key={app._id}
            app={app}
            onDownloadCv={onDownloadCv}
            onDelete={onDelete}
            isDeleting={deletingIds.includes(app._id)}
          />
        ))}
      </div>
    </>
  );
}
