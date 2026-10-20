function Notification({
  type = "info",
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${styles[type] || styles.info}`}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-lg font-semibold hover:opacity-70"
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Notification;