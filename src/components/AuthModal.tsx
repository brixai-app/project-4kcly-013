import React, { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, CheckCircle2, AlertCircle, Circle as Icon } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "@/lib/auth-client";

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
};

export function AuthModal({ open = false, onOpenChange = () => {}, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const title = useMemo(() => (tab === "signin" ? "Welcome back" : "Create your account"), [tab]);

  const validate = () => {
    const next: typeof errors = {};
    if (tab === "signup" && !form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.password.trim()) next.password = "Password is required.";
    else if (form.password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      const payload =
        tab === "signin"
          ? await signIn({ email: form.email.trim(), password: form.password })
          : await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      if ((payload as any)?.error) throw new Error((payload as any)?.error ?? "Authentication failed.");
      toast.success(tab === "signin" ? "Signed in successfully." : "Account created successfully.");
      onOpenChange(false);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    icon: Icon,
    label,
    type,
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder: string;
    autoComplete?: string;
  }) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6D6257]">{label}</span>
      <div className={cn("flex items-center gap-2 border px-3 py-2.5", error ? "border-red-400" : "border-[#D8CCB8]", "bg-[#FFFDF8]")}>
        <Icon className="h-4 w-4 shrink-0 text-[#9A7440]" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full min-w-0 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6257]/70"
        />
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </label>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 border border-[#D8CCB8] bg-[#FAF7F0] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-[#D8CCB8] pb-3">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#2B2B2B]">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[#6D6257]">
                Access your Jootiya account for faster checkout and order tracking.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center border border-[#D8CCB8] text-[#2B2B2B] transition-colors hover:border-[#9A7440] hover:text-[#9A7440]">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 flex border border-[#D8CCB8]">
            {(["signin", "signup"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "flex-1 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors",
                  tab === item ? "bg-[#9A7440] text-black" : "bg-transparent text-[#6D6257] hover:bg-[#FFFDF8]"
                )}
              >
                {item === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {tab === "signup" ? (
              <Field icon={User} label="Full name" type="text" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} error={errors.name} placeholder="Your name" autoComplete="name" />
            ) : null}
            <Field icon={Mail} label="Email address" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} error={errors.email} placeholder="you@example.com" autoComplete="email" />
            <Field icon={Lock} label="Password" type="password" value={form.password} onChange={(v) => setForm((p) => ({ ...p, password: v }))} error={errors.password} placeholder="••••••••" autoComplete={tab === "signin" ? "current-password" : "new-password"} />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 border border-[#9A7440] bg-[#9A7440] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#76562E] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Processing
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {tab === "signin" ? "Sign in" : "Create account"}
                </>
              )}
            </button>
          </form>

          <div className="mt-4 border-t border-[#D8CCB8] pt-3 text-xs text-[#6D6257]">
            By continuing, you agree to secure account access for orders, saved details, and checkout.
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;