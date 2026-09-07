import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, X, XCircle } from "lucide-react";

export const cls = (...values) => values.filter(Boolean).join(" ");

export const Card = ({ className = "", children }) => (
  <div
    className={cls(
      "rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-slate-200 p-4",
      className,
    )}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const variants = {
    primary: "bg-sky-600 hover:bg-sky-700 text-white",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cls(
        "rounded-xl transition-colors",
        variants[variant],
        sizes[size],
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
};

export function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationCard({ notification, onRemove }) {
  const { id, message, type, title } = notification;
  const icon =
    type === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : type === "error" ? (
      <XCircle className="w-5 h-5 text-red-600" />
    ) : (
      <Bell className="w-5 h-5 text-blue-600" />
    );
  const background =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-blue-50 border-blue-200";
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${background} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
          )}
          <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 ml-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export const Badge = ({ children, color = "slate", className = "" }) => (
  <span
    className={cls(
      "px-2 py-0.5 rounded-full text-xs font-medium border",
      color === "green" && "bg-emerald-50 text-emerald-700 border-emerald-200",
      color === "red" && "bg-rose-50 text-rose-700 border-rose-200",
      color === "amber" && "bg-amber-50 text-amber-700 border-amber-200",
      color === "blue" && "bg-sky-50 text-sky-700 border-sky-200",
      color === "slate" && "bg-slate-50 text-slate-700 border-slate-200",
      className,
    )}
  >
    {children}
  </span>
);

export const Input = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  ...rest
}) => (
  <input
    type={type}
    value={value}
    onChange={(event) => onChange?.(event.target.value)}
    placeholder={placeholder}
    className={cls(
      "w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300",
      className,
    )}
    {...rest}
  />
);
export const Select = ({ value, onChange, children, className = "" }) => (
  <select
    value={value}
    onChange={(event) => onChange?.(event.target.value)}
    className={cls(
      "w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300",
      className,
    )}
  >
    {children}
  </select>
);
export const Divider = ({ className = "" }) => (
  <div className={cls("h-px w-full bg-slate-200", className)} />
);

export const Modal = ({ open, onClose, title, children, footer = null }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-3 sm:p-4 shadow-xl"
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <h3 className="text-base sm:text-lg font-semibold truncate">
              {title}
            </h3>
            <button
              className="p-1 sm:p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
              onClick={onClose}
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            </button>
          </div>
          <div className="mt-3">{children}</div>
          {footer && (
            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
