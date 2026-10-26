import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import authClient from '@/lib/auth-client';

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: 'sign-in' | 'register';
  className?: string;
};

type FormState = {
  name: string;
  email: string;
  password: string;
};

const initialForm: FormState = { name: '', email: '', password: '' };

export function AuthModal({
  open = false,
  onOpenChange = () => {},
  defaultTab = 'sign-in',
  className = '',
}: AuthModalProps) {
  const [tab, setTab] = useState<'sign-in' | 'register'>(defaultTab);
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setErrors({});
      setPending(false);
    }
  }, [open, defaultTab]);

  const title = useMemo(() => (tab === 'sign-in' ? 'Welcome back' : 'Create your account'), [tab]);

  const validate = () => {
    const next: Partial<FormState> = {};
    if (tab === 'register' && !form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email.';
    if (!form.password.trim()) next.password = 'Password is required.';
    else if (form.password.trim().length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const refreshSession = async () => {
    try {
      await authClient?.getSession?.();
    } catch {
      void 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || !validate()) return;
    setPending(true);
    try {
      if (tab === 'sign-in') {
        await authClient?.signIn?.email?.({
          email: form.email.trim(),
          password: form.password,
        });
        toast.success('Signed in successfully.');
      } else {
        await authClient?.signUp?.email?.({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        toast.success('Account created successfully.');
      }
      await refreshSession();
      onOpenChange(false);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#2B1715]/55 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#CDBB9F] bg-[#FFFDF8] p-5 text-[#2B1715] shadow-2xl outline-none',
            className
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-6 text-[#765F55]">
                Access your Jootiya account to save favorites, track orders, and complete checkout.
              </Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#CDBB9F] text-[#2B1715] transition-colors hover:bg-[#F7F0E4]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-sm border border-[#CDBB9F] p-1">
            {(['sign-in', 'register'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  'rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                  tab === item ? 'bg-[#741F2B] text-white' : 'text-[#765F55] hover:bg-[#F7F0E4]'
                )}
              >
                {item === 'sign-in' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {tab === 'register' && (
              <Field
                label="Full name"
                value={form.name}
                onChange={(value) => updateField('name', value)}
                error={errors.name}
                placeholder="Your name"
                icon={<User className="h-4 w-4" />}
              />
            )}
            <Field
              label="Email"
              value={form.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              placeholder="name@example.com"
              icon={<Mail className="h-4 w-4" />}
              type="email"
            />
            <Field
              label="Password"
              value={form.password}
              onChange={(value) => updateField('password', value)}
              error={errors.password}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              type={showPassword ? 'text' : 'password'}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[#765F55] transition-colors hover:text-[#2B1715]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#57151F] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Please wait
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {tab === 'sign-in' ? 'Sign in' : 'Create account'}
                </>
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type FieldProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
};

function Field({
  label = '',
  value = '',
  onChange = () => {},
  error = '',
  placeholder = '',
  icon = null,
  trailing = null,
  type = 'text',
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.22em] text-[#765F55]">{label}</span>
      <div className={cn('flex items-center gap-2 rounded-sm border px-3 py-2.5', error ? 'border-[#741F2B]' : 'border-[#CDBB9F]')}>
        <span className="text-[#765F55]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#2B1715] outline-none placeholder:text-[#A08A7D]"
        />
        {trailing}
      </div>
      {error ? <p className="mt-1.5 text-xs leading-5 text-[#741F2B]">{error}</p> : null}
    </label>
  );
}

export default AuthModal;