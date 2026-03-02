export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-navy/5 hover:-translate-y-1 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
