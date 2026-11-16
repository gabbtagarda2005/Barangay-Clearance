export const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClass = "font-medium rounded-lg transition-all duration-200 font-sans";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-opacity-90 shadow-md hover:shadow-lg",
    secondary: "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    ghost: "text-indigo-600 hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = "info" }) => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-slate-100 text-slate-800",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const TextField = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <input
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <select
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
        {...props}
      >
        <option value="">Select {label?.toLowerCase()}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
};

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};
