export default function Select({ value, onChange, options, placeholder, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#2E6B9E] ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
