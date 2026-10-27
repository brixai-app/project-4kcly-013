import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { signIn, signUp } from '@/lib/auth-client';

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: 'signin' | 'signup';
  className?: string;
};

export function AuthModal({ open = false, onOpenChange = () => {}, defaultTab = 'signin', className = '' }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setError('');
    }
  }, [open, defaultTab]);

  const canSubmit = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(form.email?.trim() ?? '');
    const passOk = (form.password?.trim()?.length ?? 0) >= 6;
    const nameOk = tab === 'signin' ? true : (form.name?.trim()?.length ?? 0) >= 2;
    return emailOk && passOk && nameOk && !pending;
  }, [form, pending, tab]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('Please complete all required fields.');
      return;
    }
    setPending(true);
    setError('');
    try {
      const payload = { email: form.email.trim(), password: form.password.trim(), name: form.name.trim() };
      const res = tab === 'signin' ? await signIn(payload) : await signUp(payload);
      if (res?.error) throw new Error(res.error);
      toast.success(tab === 'signin' ? 'Signed in successfully.' : 'Account created successfully.');
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  const fieldClass = 'w-full rounded-md border border-[#D8CDBE] bg-[#FFFCF7] px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-[#C9A66B]';
  const labelClass = 'text-xs font-semibold uppercase tracking-[0.2em] text-[#6E665D]';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className={cn('fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2', className)}>
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} transition={{ duration: 0.28 }} className="overflow-hidden rounded-[8px] border border-[#D8CDBE] bg-[#F5F1EB] shadow-[0_24px_80px_rgba(43,43,43,0.18)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#D8CDBE] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#2B2B2B]">Welcome to Jootiya</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-[#6E665D]">Sign in to sync your cart or create a new account.</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#D8CDBE] text-[#2B2B2B] transition hover:border-[#C9A66B] hover:text-[#000000]">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-5 pt-5">
              <div className="grid grid-cols-2 gap-2 rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-1">
                {(['signin', 'signup'] as const).map((item) => (
                  <button key={item} type="button" onClick={() => setTab(item)} className={cn('rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition', tab === item ? 'bg-[#C9A66B] text-black' : 'text-[#6E665D] hover:text-[#2B2B2B]')}>
                    {item === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4 px-5 py-5">
              <AnimatePresence mode="wait">
                {tab === 'signup' ? (
                  <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                    <div className="space-y-2">
                      <label className={labelClass} htmlFor="name">Full name</label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E665D]" />
                        <input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={cn(fieldClass, 'pl-10')} placeholder="Your name" autoComplete="name" />
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="space-y-2">
                <label className={labelClass} htmlFor="email">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E665D]" />
                  <input id="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={cn(fieldClass, 'pl-10')} placeholder="name@example.com" autoComplete="email" />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass} htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E665D]" />
                  <input id="password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className={cn(fieldClass, 'pl-10')} placeholder="Minimum 6 characters" autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} />
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-md border border-[#D8CDBE] bg-white px-3 py-2 text-sm text-[#2B2B2B]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B38A4E]" />
                  <span className="min-w-0 break-words">{error}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-[#6E665D]">
                  <CheckCircle2 className="h-4 w-4 text-[#C9A66B]" />
                  <span>Secure checkout-ready account access.</span>
                </div>
              )}

              <button type="submit" disabled={!canSubmit} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#B38A4E] disabled:cursor-not-allowed disabled:opacity-60">
                {pending ? 'Please wait' : tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;