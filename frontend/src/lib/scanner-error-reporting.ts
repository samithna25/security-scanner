type ScannerErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ScannerEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ScannerErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __scannerEvents?: ScannerEvents;
  }
}

export function reportScannerError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("Scanner Error captured:", error, context);
  window.__scannerEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
