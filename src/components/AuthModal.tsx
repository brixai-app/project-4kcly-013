import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export interface AuthModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialMode?: 'signin' | 'signup';
  trigger?: React.ReactNode;
  className?: string;
}

export function AuthModal({
  open,
  defaultOpen = false,
  onOpenChange,
  initialMode = 'signin',
  trigger,
  className = '',
}: AuthModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? open : internalOpen;

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const validate = () => {
    const next: typeof errors = {};
    if (mode === 'signup' && !form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.password.trim()) next.password = 'Password is required.';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);
    try {
      const payload =
        mode === 'signin'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };
      const result =
        mode === 'signin'
          ? await authClient.signIn.email(payload.email, payload.password, { onError: () => undefined })
          : await authClient.signUp.email(payload.email, payload.password, { name: payload.name, onError: () => undefined });
      if (result?.error) throw new Error(result.error?.message ?? 'Authentication failed.');
      toast.success(mode === 'signin' ? 'Welcome back.' : 'Account created successfully.');
      setOpen(false);
      setForm({ name: '', email: '', password: '' });
      setErrors({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setPending(false);
    }
  };

  const title = useMemo(() => (mode === 'signin' ? 'Sign in' : 'Create account'), [mode]);
  const subtitle = useMemo(
    () => (mode === 'signin' ? 'Access your saved cart, orders, and artisan notes.' : 'Join to track orders and save your favorites.'),
    [mode]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <AnimatePresence>
        {isOpen ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] p-5 text-[#2E2B28] shadow-2xl outline-none',
                  className
                )}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-[Bodoni_Moda] text-3xl leading-none tracking-tight">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#6E6258]">{subtitle}</p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#CDBB9B] text-[#2E2B28] transition-colors hover:bg-[#F9F5F0]"
                      aria-label="Close dialog"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 rounded-md border border-[#CDBB9B] p-1">
                  {(['signin', 'signup'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMode(item)}
                      className={cn(
                        'rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
                        mode === item ? 'bg-[#C1440E] text-white' : 'text-[#6E6258] hover:bg-[#F9F5F0]'
                      )}
                    >
                      {item === 'signin' ? 'Sign in' : 'Sign up'}
                    </button>
                  ))}
                </div>

                <form className="mt-5 space-y-3" onSubmit={submit}>
                  {mode === 'signup' ? (
                    <Field
                      icon={<User className="h-4 w-4" />}
                      label="Full name"
                      value={form.name}
                      error={errors.name}
                      onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                      placeholder="Your name"
                    />
                  ) : null}
                  <Field
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                    placeholder="you@example.com"
                  />
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6258]">Password</label>
                    <div className="flex items-stretch overflow-hidden rounded-md border border-[#CDBB9B] bg-white">
                      <div className="flex items-center pl-3 text-[#6E6258]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="At least 8 characters"
                        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#9A8F84]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="px-3 text-[#6E6258] transition-colors hover:text-[#2E2B28]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password ? <p className="mt-1.5 text-xs text-[#963308]">{errors.password}</p> : null}
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#963308] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? 'Please wait' : mode === 'signin' ? 'Sign in' : 'Create account'}
                    {!pending ? <CheckCircle2 className="h-4 w-4" /> : null}
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

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6258]">{label}</label>
      <div className="flex items-stretch overflow-hidden rounded-md border border-[#CDBB9B] bg-white">
        <div className="flex items-center pl-3 text-[#6E6258]">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#9A8F84]"
        />
      </div>
      {error ? <p className="mt-1.5 text-xs text-[#963308]">{error}</p> : null}
    </div>
  );
}

export default AuthModal;