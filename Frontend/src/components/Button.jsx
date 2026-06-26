const Button = ({
  children,
  variant = "primary",
  loading,
  className = "",
  icon: Icon,
  type = "button",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 focus-ring disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-cyan-600 text-white shadow-sm shadow-cyan-600/20 hover:bg-cyan-700",
    danger:
      "bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-700",
    success:
      "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700",
    warning:
      "bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20 hover:bg-amber-500",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    ghost:
      "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Please wait...
        </>
      ) : (
        <>
          {Icon && <Icon size={16} aria-hidden="true" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
