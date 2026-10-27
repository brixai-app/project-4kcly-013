import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { signIn, signUp } from '@/lib/auth-client';

type AuthMode = 'signin' | 'signup';

export interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: AuthMode;
}

export function AuthModal({ open = false, onOpenChange = () => {}, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const title = useMemo(() => (mode === 'signin' ? 'Welcome back' : 'Create your account'), [mode]);

  const update = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (mode === 'signup' && form.name.trim().length < 2) return 'Please enter your full name.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Please enter a valid email address.';
    if (form.password.trim().length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const reset = () => {
    setForm({ name: '', email: '', password: '' });
    setError('');
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setPending(true);
    setError('');
    try {
      if (mode === 'signin') await signIn({ email: form.email.trim(), password: form.password });
      else await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success(mode === 'signin' ? 'Signed in successfully.' : 'Account created successfully.');
      onOpenChange(false);
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 border border-[#D8CDBB] bg-[#FAF9F6] p-5 text-[#2B2B2B] shadow-[0_24px_80px_rgba(0,0,0,0.18)] outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-[#D8CDBB] pb-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display',serif] text-3xl font-medium tracking-tight">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6E665C]">
                Secure access to your Jootiya account
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#D8CDBB] text-[#2B2B2B] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]"
                aria-label="Close authentication modal"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border border-[#D8CDBB] p-1">
            {(['signin', 'signup'] as AuthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  'border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors',
                  mode === item ? 'border-[#9A7135] bg-[#9A7135] text-black' : 'border-transparent bg-transparent text-[#6E665C] hover:text-[#2B2B2B]'
                )}
              >
                {item === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {mode === 'signup' && (
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#6E665C]">
                  <User className="h-3.5 w-3.5" /> Full name
                </span>
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  autoComplete="name"
                  className="w-full border border-[#D8CDBB] bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-[#A59A8B] focus:border-[#9A7135]"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#6E665C]">
                <Mail className="h-3.5 w-3.5" /> Email
              </span>
              <input
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                autoComplete="email"
                inputMode="email"
                className="w-full border border-[#D8CDBB] bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-[#A59A8B] focus:border-[#9A7135]"
                placeholder="name@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#6E665C]">
                <Lock className="h-3.5 w-3.5" /> Password
              </span>
              <div className="flex items-center border border-[#D8CDBB] bg-white focus-within:border-[#9A7135]">
                <input
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="min-w-0 flex-1 px-3 py-3 text-sm outline-none placeholder:text-[#A59A8B]"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="px-3 text-[#6E665C] transition-colors hover:text-[#2B2B2B]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error ? <p className="text-sm text-[#765326]">{error}</p> : null}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 border border-[#9A7135] bg-[#9A7135] px-4 py-3 text-xs uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#765326] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? 'Please wait' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;