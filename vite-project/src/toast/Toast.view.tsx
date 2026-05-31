import type { ToastViewProps } from "./Toast.types";

/** Renders a fixed-position error banner at the bottom of the screen with a dismiss button. */
export function ToastView({ message, onDismiss }: ToastViewProps) {
  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#d32f2f",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        fontFamily: "sans-serif",
        fontSize: "14px",
        zIndex: 1000,
      }}
    >
      <span>{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
