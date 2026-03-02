import { Table, TableHead, TableHeader, TableBody } from '../ui/Table';
import ApplicationRow from './ApplicationRow';

const COLUMNS = ['Name', 'Email', 'Phone', 'Type', 'Amount', 'Status', 'Date', 'Actions'];

export default function ApplicationTable({ applications, onDownloadCv, onDelete }) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-10 text-[#5A6A7A]">
        No applications found.
      </div>
    );
  }

  return (
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
          />
        ))}
      </TableBody>
    </Table>
  );
}
