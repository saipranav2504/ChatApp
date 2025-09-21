import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500/90 border-green-400/50 text-white";
      case "error":
        return "bg-red-500/90 border-red-400/50 text-white";
      default:
        return "bg-blue-500/90 border-blue-400/50 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-white" />;
      case "error":
        return <XCircle size={20} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-slideInRight ${getToastStyles()}`}
    >
      {getIcon()}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
