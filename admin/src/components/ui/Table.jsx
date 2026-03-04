export function Table({ children }) {
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="w-full min-w-[640px] border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
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
    <th className={`px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold whitespace-nowrap ${className}`}>
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
    <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${className}`}>{children}</td>
  );
}
