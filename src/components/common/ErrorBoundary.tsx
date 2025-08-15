import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage?: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // In a real app, report to monitoring here
    // console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="healthcare-card p-6 max-w-md text-center">
            <h2 className="healthcare-heading text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="healthcare-text-secondary text-sm mb-4">{this.state.errorMessage}</p>
            {this.props.fallback}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


