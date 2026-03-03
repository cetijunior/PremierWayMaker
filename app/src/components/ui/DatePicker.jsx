export default function DatePicker({ label, id, error, className = '', ...props }) {
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-navy mb-1.5 tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type="date"
        className={`w-full px-4 py-3 bg-cream/60 border-2 border-gray-200 rounded-xl text-base text-navy placeholder:text-text-light/50 transition-all duration-200 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 focus:bg-white ${
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}
