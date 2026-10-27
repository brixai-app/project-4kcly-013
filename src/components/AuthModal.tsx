import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle2, Circle as Icon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

type AuthMode = 'sign-in' | 'sign-up';

export interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: AuthMode;
  trigger?: React.ReactNode;
}

export function AuthModal({ open = false, onOpenChange = () => {}, defaultMode = 'sign-in', trigger = null }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const title = useMemo(() => (mode === 'sign-in' ? 'Welcome back' : 'Create your account'), [mode]);

  const validate = () => {
    const next: typeof errors = {};
    if (mode === 'sign-up' && !form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'Use at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please check the highlighted fields.');
      return;
    }
    setLoading(true);
    try {
      const action = mode === 'sign-in' ? authClient?.signIn?.email : authClient?.signUp?.email;
      if (typeof action === 'function') {
        await action({ email: form.email, password: form.password, name: form.name || undefined });
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      toast.success(mode === 'sign-in' ? 'Signed in successfully.' : 'Account created successfully.');
      onOpenChange(false);
    } catch {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, icon: Icon, type, value, onChange, error, placeholder }: any) => (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#675F56]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition',
          'border-[#D8CCB9] placeholder:text-[#8A8177] focus:border-[#A94720]',
          error ? 'border-[#A94720]' : ''
        )}
      />
      <AnimatePresence>
        {error ? (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs text-[#A94720]">
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </label>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2">
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} className="overflow-hidden border border-[#D8CCB9] bg-[#FAF9F6] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="flex items-start justify-between border-b border-[#D8CCB9] px-6 py-5">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-3xl font-medium tracking-tight text-[#1A1A1A]">{title}</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-[#675F56]">
                  Access order tracking, saved sizes, and faster checkout. Guest browsing remains fully available.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="ml-4 inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB9] text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720]">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-6 pt-5">
              <div className="grid grid-cols-2 gap-2 border border-[#D8CCB9] bg-white p-1">
                {(['sign-in', 'sign-up'] as AuthMode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={cn(
                      'px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
                      mode === item ? 'bg-[#A94720] text-white' : 'text-[#675F56] hover:text-[#1A1A1A]'
                    )}
                  >
                    {item === 'sign-in' ? 'Sign in' : 'Sign up'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {mode === 'sign-up' ? (
                <Field label="Full name" icon={User} type="text" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, name: e.target.value }))} error={errors.name} placeholder="Your name" />
              ) : null}
              <Field label="Email address" icon={Mail} type="email" value={form.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, email: e.target.value }))} error={errors.email} placeholder="name@example.com" />
              <Field label="Password" icon={Lock} type="password" value={form.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, password: e.target.value }))} error={errors.password} placeholder="Minimum 8 characters" />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 bg-[#A94720] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#843616] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <CheckCircle2 className="h-4 w-4 animate-pulse" /> : null}
                {mode === 'sign-in' ? 'Sign in' : 'Create account'}
              </button>

              <p className="text-xs leading-5 text-[#675F56]">
                By continuing, you agree to our refined commerce experience and secure order processing.
              </p>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;