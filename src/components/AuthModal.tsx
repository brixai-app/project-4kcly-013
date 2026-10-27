import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { signIn, signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: 'signin' | 'signup';
  className?: string;
}

export function AuthModal({
  open = false,
  onOpenChange = () => {},
  defaultMode = 'signin',
  className = '',
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const title = useMemo(() => (mode === 'signin' ? 'Sign in' : 'Create account'), [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email?.trim() || !form.password?.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && !form.name?.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') await signIn({ email: form.email, password: form.password });
      else await signUp({ name: form.name, email: form.email, password: form.password });
      toast.success(mode === 'signin' ? 'Signed in successfully.' : 'Account created successfully.');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#CFC2B2] bg-[#FFFDF7] p-5 text-[#2B2B2B] shadow-2xl outline-none',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[#6F655C]">
                Access your order history, saved details, and faster checkout.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#CFC2B2] text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-md border border-[#CFC2B2] p-1">
            {(['signin', 'signup'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  'rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                  mode === item ? 'bg-[#E07A5F] text-black' : 'text-[#6F655C] hover:bg-[#F5F1EB]',
                )}
              >
                {item === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3">
            {mode === 'signup' && (
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F655C]">
                  <User className="h-3.5 w-3.5" />
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-md border border-[#CFC2B2] bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[#A79A8D] focus:border-[#E07A5F]"
                  placeholder="Your full name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F655C]">
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                type="email"
                autoComplete="email"
                className="w-full rounded-md border border-[#CFC2B2] bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[#A79A8D] focus:border-[#E07A5F]"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F655C]">
                <Lock className="h-3.5 w-3.5" />
                Password
              </span>
              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full rounded-md border border-[#CFC2B2] bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[#A79A8D] focus:border-[#E07A5F]"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E07A5F] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-[#C85F45] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Please wait' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-4 flex items-start gap-2 rounded-md border border-[#CFC2B2] bg-[#F5F1EB] p-3 text-sm text-[#6F655C]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E07A5F]" />
            <p>
              Customer checkout remains guest-friendly; this modal is available for account access only.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;