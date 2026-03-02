const VARIANTS = {
  primary: 'bg-[#f5b800] text-[#1B2A4A] hover:bg-[#e0a520]',
  secondary: 'bg-[#2E6B9E] text-white hover:bg-[#245b88]',
  danger: 'bg-red-500 text-white hover:bg-red-600 text-sm py-1.5 px-3.5',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-block px-7 py-3 rounded-lg font-semibold text-base cursor-pointer transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
