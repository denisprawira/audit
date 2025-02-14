import React, { useState, useEffect, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: FallbackProps) => ReactNode;
}

interface FallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
}

interface ErrorInfo {
  componentStack?: string;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const handleError = (error: Error, errorInfo: ErrorInfo) => {
      setHasError(true);
      setError(error);
      setErrorInfo(errorInfo);
      // You can also log the error to an error reporting service here
    };

    // Add event listener for uncaught errors
    const handleWindowError = (event: ErrorEvent) => {
      handleError(event.error, { componentStack: event.error?.stack });
    };

    // Add event listener for unhandled promise rejections
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      handleError(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
        { componentStack: event.reason?.stack },
      );
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  const resetError = (): void => {
    setHasError(false);
    setError(null);
    setErrorInfo(null);
  };

  if (hasError) {
    // You can render any custom fallback UI
    return fallback ? (
      fallback({ error, errorInfo, resetError })
    ) : (
      <div className="p-4 m-4 border border-red-500 rounded bg-red-50">
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Something went wrong
        </h2>
        <details className="whitespace-pre-wrap">
          <summary className="text-red-600 cursor-pointer">
            Error details
          </summary>
          <pre className="mt-2 text-sm text-red-600">
            {error?.toString()}
            {"\n"}
            {errorInfo?.componentStack}
          </pre>
        </details>
        <button
          onClick={resetError}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
