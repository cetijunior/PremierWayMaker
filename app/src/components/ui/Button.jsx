const VARIANTS = {
  primary:
    'bg-linear-to-r from-gold to-gold-light text-navy hover:shadow-[0_0_20px_rgba(245,183,49,0.3)]',
  secondary:
    'bg-linear-to-r from-blue to-blue-light text-white hover:shadow-[0_0_20px_rgba(46,107,158,0.3)]',
  danger:
    'bg-red-500 text-white hover:bg-red-600 text-sm py-1.5 px-3.5',
  ghost:
    'bg-white/10 text-white hover:bg-white/20 border border-white/20',
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
      className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-base cursor-pointer transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${VARIANTS[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
