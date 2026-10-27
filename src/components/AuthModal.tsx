import React from 'react';
import { useMemo, useState } from 'react';
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
  trigger?: React.ReactNode;
}

export function AuthModal({ open = false, onOpenChange = () => {}, defaultMode = 'signin', trigger = null }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', password: '' });

  const title = useMemo(() => (mode === 'signin' ? 'Welcome back' : 'Create your account'), [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = values.email.trim();
    const password = values.password.trim();
    const name = values.name.trim();

    if (!email || !password || (mode === 'signup' && !name)) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn({ email, password });
        toast.success('Signed in successfully.');
      } else {
        await signUp({ name, email, password });
        toast.success('Account created successfully.');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-sm border border-[#BFA6A0] bg-[#FFFDFC] px-3 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-[#D9381E]';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#BFA6A0] bg-[#F9F5F0] p-5 text-[#2B2B2B] shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-6 text-[#6F625D]">
                Access your Jootiya account for faster checkout, saved addresses, and order tracking.
              </Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#BFA6A0] text-[#2B2B2B] transition hover:border-[#D9381E] hover:text-[#D9381E]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-sm border border-[#BFA6A0] p-1">
            {(['signin', 'signup'] as AuthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  'rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-widest transition',
                  mode === item ? 'bg-[#D9381E] text-white' : 'text-[#6F625D] hover:text-[#2B2B2B]'
                )}
              >
                {item === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === 'signup' ? (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F625D]">
                  <User className="h-4 w-4" />
                  Full Name
                </span>
                <input value={values.name} onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))} className={inputClass} autoComplete="name" />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F625D]">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <input value={values.email} onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))} className={inputClass} type="email" autoComplete="email" />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6F625D]">
                <Lock className="h-4 w-4" />
                Password
              </span>
              <div className="relative">
                <input
                  value={values.password}
                  onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
                  className={cn(inputClass, 'pr-11')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 top-0 inline-flex h-full w-11 items-center justify-center text-[#6F625D] transition hover:text-[#2B2B2B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#D9381E] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#B92B17] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Please wait' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs leading-5 text-[#6F625D]">
            By continuing, you agree to our refined checkout and account terms.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;