export function Table({ children }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-slate-600 border-collapse whitespace-nowrap">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold tracking-wider">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <th className={`px-4 sm:px-6 py-4 border-b border-slate-200 ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="hover:bg-slate-50/80 transition-colors duration-150">{children}</tr>;
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-4 sm:px-6 py-4 align-middle ${className}`}>{children}</td>
  );
}
