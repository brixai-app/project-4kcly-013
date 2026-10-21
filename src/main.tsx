import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/shadcn';
import App from './App';
import './index.css';

class ErrorBoundary extends Component<
  React.PropsWithChildren,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <header className="w-full border-b border-border px-6 py-7 lg:px-12">
          <span className="font-serif text-3xl tracking-wide">Jootiya</span>
        </header>

        <section
          className="flex w-full flex-1 items-center py-20"
          aria-labelledby="recovery-heading"
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
            <div role="alert" className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Crafted in Jodhpur
              </p>
              <h1
                id="recovery-heading"
                className="whitespace-normal break-words font-serif text-4xl leading-tight sm:text-6xl"
              >
                A moment to find our footing.
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
                Something interrupted the storefront. Reload the page to try
                again. Saved browser data has not been intentionally cleared,
                though your latest changes may not have been saved.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 min-h-12 gap-2 px-6 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Reload storefront
            </Button>
          </div>
        </section>

        <footer className="w-full border-t border-border px-6 py-6 text-sm leading-relaxed text-muted-foreground lg:px-12">
          Browser-only demonstration. Products, reviews, orders, and checkout use
          mock data; no real payments are processed.
        </footer>
      </main>
    );
  }
}

// Recover gracefully if the host document omitted the expected mount element.
let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);