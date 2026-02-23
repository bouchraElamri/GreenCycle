export default function Button({
  children,
  onClick,
  variant = "green",
  base = "",
  className = "",
  type = "button",
  disabled = false,
}) {
  const baseClasses =
    "inline-flex items-center justify-center text-center leading-none px-4 py-2 rounded-3xl font-medium transition";


  const styles = {
    green: "bg-green-dark text-white-intense hover:bg-green-700 font-nexa ",
    white: "bg-white-intense text-green-dark hover:bg-gray-300  hover:border-green-dark",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${styles[variant] || styles.green} ${base} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
