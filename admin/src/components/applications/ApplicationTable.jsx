import { Table, TableHead, TableHeader, TableBody } from '../ui/Table';
import ApplicationRow from './ApplicationRow';
import ApplicationCard from './ApplicationCard';

const COLUMNS = ['Name', 'Email', 'Phone', 'Type', 'Amount', 'Status', 'Booking', 'Date', 'Actions'];

export default function ApplicationTable({ applications, onDownloadCv, onDelete, isDemo }) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-10 text-[#5A6A7A]">
        No applications found.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
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
                isDemo={isDemo}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <ApplicationCard
            key={app._id}
            app={app}
            onDownloadCv={onDownloadCv}
            onDelete={onDelete}
            isDemo={isDemo}
          />
        ))}
      </div>
    </>
  );
}
