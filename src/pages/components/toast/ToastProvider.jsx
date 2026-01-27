import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle2 size={18} className="text-green-600" />,
  error: <XCircle size={18} className="text-red-600" />,
  info: <Info size={18} className="text-blue-600" />,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message, opts = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const duration = opts.duration ?? 2500;

      setToasts((prev) => [...prev, { id, type, message }]);

      window.setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  const api = useMemo(
    () => ({
      success: (msg, opts) => show("success", msg, opts),
      error: (msg, opts) => show("error", msg, opts),
      info: (msg, opts) => show("info", msg, opts),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-[10000] space-y-2 w-[320px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-white border shadow-sm rounded-lg p-3 flex items-start gap-2"
          >
            <div className="mt-0.5">{icons[t.type] || icons.info}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">{t.message}</div>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-gray-400 hover:text-gray-700"
              type="button"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
};
