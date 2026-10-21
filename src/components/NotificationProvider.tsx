import React, { type CSSProperties, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/shadcn';

/**
 * Presentation only: mount once around the application.
 * Callers invoke Sonner directly; demo business state and persistence stay in @/mock.
 * Notifications do not imply real payments, shipments, or backend operations.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        theme="light"
        position="bottom-right"
        offset={24}
        duration={5500}
        visibleToasts={3}
        closeButton
        richColors={false}
        expand={false}
        className="jootiya-notifications"
        style={
          {
            '--normal-bg': '#fffaf2',
            '--normal-text': '#342620',
            '--normal-border': '#d8c6b3',
            '--mobile-offset-left': '16px',
            '--mobile-offset-right': '16px',
            '--mobile-offset-bottom': 'max(16px, env(safe-area-inset-bottom))',
            fontFamily: 'inherit',
          } as CSSProperties
        }
        toastOptions={{
          classNames: {
            toast: 'jootiya-toast',
            title: 'jootiya-toast-title',
            description: 'jootiya-toast-description',
            actionButton: 'jootiya-toast-action',
            cancelButton: 'jootiya-toast-cancel',
            closeButton: 'jootiya-toast-close',
          },
        }}
      />
      <style>{`
        .jootiya-notifications [data-sonner-toast].jootiya-toast {
          padding: 20px 52px 20px 20px;
          gap: 12px;
          border: 1px solid #d8c6b3;
          border-radius: 12px;
          background: #fffaf2;
          color: #342620;
          box-shadow: 0 8px 32px rgb(52 38 32 / 12%);
          font-family: inherit;
        }
        .jootiya-notifications .jootiya-toast-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }
        .jootiya-notifications .jootiya-toast-description {
          color: #665247;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .jootiya-notifications [data-sonner-toast] .jootiya-toast-close {
          top: 10px;
          right: 10px;
          left: auto;
          transform: none;
          width: 30px;
          height: 30px;
          border: 1px solid #d8c6b3;
          background: #f3e9dc;
          color: #342620;
          transition: background-color 160ms ease;
        }
        .jootiya-notifications [data-sonner-toast] .jootiya-toast-close:hover {
          background: #e5d5c3;
        }
        .jootiya-notifications [data-sonner-toast] .jootiya-toast-action {
          height: auto;
          min-height: 36px;
          padding: 8px 12px;
          background: #672f3b;
          color: #fffaf2;
          white-space: normal;
        }
        .jootiya-notifications [data-sonner-toast] .jootiya-toast-cancel {
          height: auto;
          min-height: 36px;
          padding: 8px 12px;
          background: #eee1d2;
          color: #342620;
          white-space: normal;
        }
        .jootiya-notifications button:focus-visible {
          outline: 2px solid #843c4b;
          outline-offset: 3px;
        }
        .dark .jootiya-notifications [data-sonner-toast].jootiya-toast {
          background: #302723;
          border-color: #796355;
          color: #fff5e9;
        }
        .dark .jootiya-notifications .jootiya-toast-description {
          color: #e0cdbb;
        }
        @media (prefers-reduced-motion: reduce) {
          .jootiya-notifications [data-sonner-toast],
          .jootiya-notifications [data-sonner-toast] button {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default NotificationProvider;