import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft, ChevronDown, ChevronUp, Copy, Check, Terminal, ShieldAlert, Sparkles } from 'lucide-react';

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
  copied: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    showDetails: false,
    copied: false,
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
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, showDetails: false, copied: false });
    this.props.onReset?.();
  };

  handleNavigateReturn = () => {
    const target = this.props.returnUrl || '/interview/setup';
    window.location.assign(target);
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  handleCopyError = () => {
    const errText = `${this.state.error?.name || 'Error'}: ${this.state.error?.message || 'Unknown'}\n\nStack:\n${this.state.error?.stack || 'No stack trace available'}`;
    navigator.clipboard.writeText(errText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    }).catch((err) => {
      console.warn('Failed to copy to clipboard:', err);
    });
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
        fallbackTitle = 'Interview room error',
        fallbackSubtitle = 'An unexpected error interrupted this view. You can retry the operation or return safely.',
        returnLabel = 'Return to Setup',
        showRetry = true,
      } = this.props;

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#080C16] text-white select-none overflow-hidden"
        >
          {/* Ambient Lighting & Background Meshes */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-amber-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
          
          {/* Subtle Grid Lines Overlay */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
          />

          {/* Obsidian Glass Center Card */}
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-[#0F172A]/90 p-8 sm:p-10 shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl text-center overflow-hidden transition-all duration-300">
            {/* Top highlight gradient rim */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            {/* Glowing System Recovery Icon */}
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-xl animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                <AlertTriangle className="h-8 w-8 text-amber-400" aria-hidden="true" />
              </div>
            </div>

            {/* Mini Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>System Recovery</span>
            </div>

            {/* Error Title & Subtitle */}
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2.5">
              {fallbackTitle}
            </h2>
            <p className="font-body text-sm text-slate-300/80 leading-relaxed mb-6 max-w-md mx-auto">
              {fallbackSubtitle}
            </p>

            {/* Concise Error Message Box */}
            <div className="mb-7 rounded-2xl border border-red-500/25 bg-red-950/30 p-4 text-left backdrop-blur-md shadow-inner">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                  Exception Diagnostic
                </span>
                <button
                  type="button"
                  onClick={this.handleCopyError}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
                  title="Copy error details"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-red-200/90 break-words leading-relaxed bg-black/40 rounded-xl p-3 border border-red-500/10">
                {this.state.error.message || 'Unknown runtime exception'}
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {showRetry && (
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              )}
              <button
                type="button"
                onClick={this.handleNavigateReturn}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-sm active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 text-slate-400" />
                <span>{returnLabel}</span>
              </button>
            </div>

            {/* Collapsible diagnostic stack trace for developers */}
            {this.state.error.stack && (
              <div className="mt-8 pt-5 border-t border-white/[0.08] text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    Diagnostic Stack Trace
                  </span>
                  {this.state.showDetails ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-3 max-h-52 overflow-auto rounded-xl bg-black/60 p-3.5 text-[11px] font-mono text-slate-300 border border-white/[0.08] leading-normal whitespace-pre-wrap select-text">
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
