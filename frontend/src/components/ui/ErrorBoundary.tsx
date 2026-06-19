"use client";
import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches render errors across all dashboard pages.
 * Shows a green-themed recovery UI instead of a blank/crashed screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production: send to monitoring (Sentry, Datadog, etc.)
    console.error("[EcoSentinel ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "3rem", textAlign: "center",
            background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 18, gap: "1rem", minHeight: 240,
          }}
        >
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#f0fdf4" }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "rgba(134,239,172,0.5)", maxWidth: 360 }}>
            {this.state.error?.message || "An unexpected error occurred in this section."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              color: "#f0fdf4", fontWeight: 600, fontSize: "0.875rem",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
