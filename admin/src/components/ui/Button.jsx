const VARIANTS = {
  primary: 'bg-[#2E6B9E] text-white hover:bg-[#245b88]',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-[#5A6A7A] hover:bg-gray-100',
};

const SIZES = {
  sm: 'py-1.5 px-3.5 text-sm',
  md: 'py-2.5 px-6 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
