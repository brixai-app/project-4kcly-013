import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

type AuthMode = 'signin' | 'signup';

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: AuthMode;
  className?: string;
};

type FormState = {
  name: string;
  email: string;
  password: string;
};

export function AuthModal({
  open = false,
  onOpenChange = () => {},
  defaultMode = 'signin',
  className = '',
}: AuthModalProps = {}) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const title = useMemo(() => (mode === 'signin' ? 'Welcome back' : 'Create your account'), [mode]);

  const validate = () => {
    const next: Partial<FormState> = {};
    if (mode === 'signup' && !form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email.';
    if (!form.password.trim()) next.password = 'Password is required.';
    else if (form.password.trim().length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm({ name: '', email: '', password: '' });
    setErrors({});
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);
    try {
      const payload = { email: form.email.trim(), password: form.password.trim(), name: form.name.trim() };
      const action = mode === 'signin' ? auth?.signIn : auth?.signUp;
      const result = await action?.(payload as never);
      if (result?.error) throw new Error(result.error?.message ?? 'Authentication failed.');
      toast.success(mode === 'signin' ? 'Signed in successfully.' : 'Account created successfully.');
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#17130F]/60 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 border border-[#CBBCA7] bg-[#FFFDF8] p-0 text-[#17130F] shadow-[0_24px_80px_rgba(23,19,15,0.18)] outline-none',
            className
          )}
        >
          <div className="flex items-start justify-between border-b border-[#CBBCA7] px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 font-['Lora'] text-sm text-[#6F6254]">
                Access your Jootiya account for saved carts, orders, and artisan stories.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="ml-4 inline-flex h-9 w-9 items-center justify-center border border-[#CBBCA7] text-[#17130F] transition-colors hover:bg-[#A8472A] hover:text-white"
                aria-label="Close authentication modal"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="border-b border-[#CBBCA7] px-5 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {(['signin', 'signup'] as AuthMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={cn(
                    'border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                    mode === item
                      ? 'border-[#A8472A] bg-[#A8472A] text-white'
                      : 'border-[#CBBCA7] bg-transparent text-[#6F6254] hover:border-[#A8472A] hover:text-[#17130F]'
                  )}
                >
                  {item === 'signin' ? 'Sign in' : 'Sign up'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' ? (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-1.5"
                >
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6254]">
                    <User className="h-4 w-4" />
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-[#CBBCA7] bg-white px-3 py-3 font-['Lora'] text-sm text-[#17130F] outline-none transition-colors placeholder:text-[#9A8F82] focus:border-[#A8472A]"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {errors.name ? <p className="text-xs text-[#A8472A]">{errors.name}</p> : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6254]">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full border border-[#CBBCA7] bg-white px-3 py-3 font-['Lora'] text-sm text-[#17130F] outline-none transition-colors placeholder:text-[#9A8F82] focus:border-[#A8472A]"
                placeholder="name@example.com"
                autoComplete="email"
                inputMode="email"
              />
              {errors.email ? <p className="text-xs text-[#A8472A]">{errors.email}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6254]">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full border border-[#CBBCA7] bg-white px-3 py-3 font-['Lora'] text-sm text-[#17130F] outline-none transition-colors placeholder:text-[#9A8F82] focus:border-[#A8472A]"
                placeholder="At least 8 characters"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              {errors.password ? <p className="text-xs text-[#A8472A]">{errors.password}</p> : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#A8472A] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#84351F] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-pulse" />
                  Please wait
                </>
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </button>

            <p className="text-center text-sm text-[#6F6254]">
              {mode === 'signin' ? 'New to Jootiya?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold text-[#A8472A] underline decoration-[#A8472A]/40 underline-offset-4"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;