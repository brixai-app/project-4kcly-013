import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: 'signin' | 'signup';
};

type FormState = {
  name: string;
  email: string;
  password: string;
};

const initialForm: FormState = { name: '', email: '', password: '' };

export function AuthModal({ open = false, onOpenChange = () => {}, defaultTab = 'signin' }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [routeKey, setRouteKey] = useState('');

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const syncRoute = () => setRouteKey(`${window.location.pathname}${window.location.hash}`);
    syncRoute();
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setErrors({});
      setShowPassword(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) onOpenChange(false);
  }, [routeKey]);

  const title = useMemo(() => (tab === 'signin' ? 'Welcome back' : 'Create your account'), [tab]);

  const validate = () => {
    const next: Partial<FormState> = {};
    if (tab === 'signup' && !form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.password.trim()) next.password = 'Password is required';
    else if (form.password.trim().length < 8) next.password = 'Use at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = tab === 'signin' ? '/api/auth/sign-in' : '/api/auth/sign-up';
      const payload = tab === 'signin'
        ? { email: form.email.trim(), password: form.password }
        : { name: form.name.trim(), email: form.email.trim(), password: form.password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string; error?: string } | null;
      if (!res.ok || data?.success === false) throw new Error(data?.message ?? data?.error ?? 'Authentication failed');
      toast.success(tab === 'signin' ? 'Signed in successfully.' : 'Account created successfully.');
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = 'w-full rounded-sm border border-[#C9BFB1] bg-[#FFFCF7] px-3 py-3 text-sm text-[#302D29] outline-none transition focus:border-[#6B1E1E]';
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#71695F]';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-[#0a0a0a]/55 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                role="dialog"
                aria-modal="true"
                className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#C9BFB1] bg-[#F5F1EB] p-4 text-[#302D29] shadow-2xl outline-none"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#71695F]">Jootiya account</p>
                    <Dialog.Title className="mt-2 font-['Bodoni_Moda'] text-3xl font-light tracking-tight text-[#302D29]">
                      {title}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#C9BFB1] bg-[#FFFCF7] text-[#302D29] transition hover:border-[#6B1E1E] hover:text-[#6B1E1E]">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-sm border border-[#C9BFB1] bg-[#FFFCF7] p-1">
                  {(['signin', 'signup'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={cn(
                        'rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition',
                        tab === item ? 'bg-[#6B1E1E] text-white' : 'text-[#71695F] hover:text-[#302D29]'
                      )}
                    >
                      {item === 'signin' ? 'Sign in' : 'Sign up'}
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="mt-4 space-y-3">
                  {tab === 'signup' && (
                    <div>
                      <label className={labelClass}>Name</label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71695F]" />
                        <input
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className={cn(fieldClass, 'pl-10')}
                          placeholder="Your full name"
                          autoComplete="name"
                        />
                      </div>
                      {errors.name ? <p className="mt-1 flex items-center gap-1 text-xs text-[#6B1E1E]"><AlertCircle className="h-3.5 w-3.5" />{errors.name}</p> : null}
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71695F]" />
                      <input
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className={cn(fieldClass, 'pl-10')}
                        placeholder="name@example.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                    {errors.email ? <p className="mt-1 flex items-center gap-1 text-xs text-[#6B1E1E]"><AlertCircle className="h-3.5 w-3.5" />{errors.email}</p> : null}
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71695F]" />
                      <input
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        className={cn(fieldClass, 'pl-10 pr-11')}
                        placeholder="Minimum 8 characters"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-[#71695F] transition hover:bg-[#F5F1EB] hover:text-[#302D29]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password ? <p className="mt-1 flex items-center gap-1 text-xs text-[#6B1E1E]"><AlertCircle className="h-3.5 w-3.5" />{errors.password}</p> : null}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#6B1E1E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#501515] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Check className="h-4 w-4" />}
                    {tab === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default AuthModal;