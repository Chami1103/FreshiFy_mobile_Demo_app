import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">Something went wrong.</h2>
          <p className="mt-2 text-red-600 dark:text-red-400">We're sorry for the inconvenience. Please try again.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
