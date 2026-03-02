export function Table({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead>
      <tr className="bg-[#1B2A4A] text-white">{children}</tr>
    </thead>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-sm font-semibold ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="hover:bg-gray-50 border-b border-gray-100">{children}</tr>;
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>
  );
}
