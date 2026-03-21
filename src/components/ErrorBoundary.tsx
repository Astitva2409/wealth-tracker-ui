// =============================================================
//  src/components/ErrorBoundary.tsx

import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    // Optional custom fallback — defaults to our built-in error UI
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    // Called when a child throws an error
    // Return new state to show the fallback UI
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error.message };
    }

    // Called after an error is caught — good place to log to a service
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        // In production: send to Sentry, Datadog etc.
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: '' });
    };

    render() {
        if (this.state.hasError) {
            // Show custom fallback if provided
            if (this.props.fallback) return this.props.fallback;

            // Default error UI
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
                        <p className="text-4xl mb-4">⚠️</p>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            {this.state.errorMessage || 'An unexpected error occurred.'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                            >
                                Go home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}