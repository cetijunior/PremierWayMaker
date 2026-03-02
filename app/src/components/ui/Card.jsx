export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-lg p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
