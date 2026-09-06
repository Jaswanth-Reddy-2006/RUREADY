import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  returnUrl?: string;
  returnLabel?: string;
  showRetry?: boolean;
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    showDetails: false,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo.componentStack);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, showDetails: false });
    this.props.onReset?.();
  };

  handleNavigateReturn = () => {
    const target = this.props.returnUrl || '/interview/setup';
    window.location.assign(target);
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const {
        fallbackTitle = 'Something went wrong',
        fallbackSubtitle = 'An unexpected error interrupted this view. You can retry the operation or return safely.',
        returnLabel = 'Return to Setup',
        showRetry = true,
      } = this.props;

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="relative min-h-[420px] w-full flex flex-col items-center justify-center p-6 bg-obsidian-950 text-white select-none"
        >
          {/* Ambient background glow */}
          <div
            className="absolute w-72 h-72 rounded-full bg-solar-orange-500/10 blur-[90px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Obsidian dark glass card */}
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-obsidian-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
            {/* Warning Icon Badge */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-solar-orange-500/10 border border-solar-orange-500/30 text-solar-orange-500 shadow-[0_0_20px_rgba(255,122,0,0.18)]">
              <AlertTriangle className="h-8 w-8 animate-pulse" aria-hidden="true" />
            </div>

            {/* Error Title & Subtitle */}
            <h2 className="font-display text-2xl font-bold tracking-tight text-white mb-2.5">
              {fallbackTitle}
            </h2>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-4">
              {fallbackSubtitle}
            </p>

            {/* Concise Error Message */}
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300 font-mono text-left break-words">
              {this.state.error.message || 'Unknown runtime exception'}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {showRetry && (
                <Button
                  variant="primary"
                  size="md"
                  icon={<RotateCcw className="h-4 w-4" />}
                  onClick={this.handleReset}
                  className="w-full sm:w-auto"
                >
                  Try Again
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                icon={<Home className="h-4 w-4" />}
                onClick={this.handleNavigateReturn}
                className="w-full sm:w-auto"
              >
                {returnLabel}
              </Button>
            </div>

            {/* Collapsible diagnostic details */}
            {import.meta.env.DEV && this.state.error.stack && (
              <div className="mt-6 pt-5 border-t border-white/[0.08] text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-xs font-mono text-white/50 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Diagnostic Stack Trace</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-obsidian-950 p-3 text-[11px] font-mono text-white/70 border border-white/[0.06] leading-normal whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
