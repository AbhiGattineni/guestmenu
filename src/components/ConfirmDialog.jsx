import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}) => {
  const modalRoot = useRef(document.createElement("div"));

  useEffect(() => {
    const currentModalRoot = modalRoot.current;
    document.body.appendChild(currentModalRoot);
    return () => {
      document.body.removeChild(currentModalRoot);
    };
  }, []);

  if (!isOpen) return null;

  const colorClasses = {
    danger: {
      icon: "text-red-600",
      iconBg: "bg-red-100",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const colors = colorClasses[type] || colorClasses.danger;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <svg
                className={`w-6 h-6 ${colors.icon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 transition duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${colors.button} text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot.current);
};

export default ConfirmDialog;
