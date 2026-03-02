export default function Input({ label, id, error, ...props }) {
  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={id} className="block font-semibold mb-1.5 text-[#1B2A4A] text-sm">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[#2E6B9E]"
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
