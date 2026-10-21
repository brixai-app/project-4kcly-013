import React, { Component, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import "./index.css";
import App from "./App";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // In a real app we might send this to an error reporting service.
    // For this frontend-only mock we simply log to console to avoid blank screens.
    // eslint-disable-next-line no-console
    console.error("Jootiya ErrorBoundary caught an error", { error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-xl border border-border/60 rounded-2xl bg-background/80 shadow-md p-8 space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight font-['Playfair_Display']">
              Something went wrong.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              The Jootiya storefront encountered an unexpected error. This is a client-side only,
              mocked experience with no backend. You can safely refresh the page or try returning to
              the home view.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#2f3f5b] px-4 py-2 text-sm font-medium text-white hover:bg-[#253347] transition-colors"
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: 9999,
              border: "1px solid rgba(15,23,42,0.08)",
              background: "rgba(250, 248, 244, 0.97)",
              color: "#1f2933",
            },
          }}
          richColors
        />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);