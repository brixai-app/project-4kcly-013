import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { ModalContractProps } from "@/types";

type Mode = "signin" | "signup";

type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

export type AuthModalProps = ModalContractProps & {
  mode?: Mode;
  onModeChange?: (mode: Mode) => void;
  onSuccess?: () => void;
};

const defaultProps: Required<Pick<AuthModalProps, "open" | "onOpenChange" | "mode" | "onModeChange" | "onSuccess">> = {
  open: false,
  onOpenChange: () => undefined,
  mode: "signin",
  onModeChange: () => undefined,
  onSuccess: () => undefined,
};

export function AuthModal({
  open = defaultProps.open,
  onOpenChange = defaultProps.onOpenChange,
  mode = defaultProps.mode,
  onModeChange = defaultProps.onModeChange,
  onSuccess = defaultProps.onSuccess,
}: AuthModalProps) {
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  useEffect(() => {
    if (!open) {
      setErrors({});
      setLoading(false);
      setShowPassword(false);
    }
  }, [open]);

  const isSignup = activeMode === "signup";

  const validate = () => {
    const next: FieldErrors = {};
    if (isSignup && name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.trim().length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitLabel = useMemo(() => (isSignup ? "Create account" : "Sign in"), [isSignup]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = { email: email.trim(), password: password.trim(), name: name.trim() };
      const action = isSignup ? authClient.signUp : authClient.signIn;
      const result = await action(payload as never);
      if ((result as { error?: { message?: string } } | undefined)?.error) {
        throw new Error((result as { error?: { message?: string } })?.error?.message ?? "Authentication failed.");
      }
      toast.success(isSignup ? "Account created successfully." : "Welcome back.");
      onSuccess?.();
      onOpenChange?.(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: Mode) => {
    setActiveMode(next);
    onModeChange?.(next);
    setErrors({});
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 outline-none">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border border-[#8A806F] bg-[#FFFDF8] text-[#211F1C] shadow-[0_24px_80px_rgba(33,31,28,0.18)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#8A806F]/70 px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">
                  {isSignup ? "Join Jootiya" : "Welcome back"}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-[#514B42]">
                  Continue as a guest anytime. Shopping is never gated.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center border border-[#8A806F] text-[#211F1C] transition-colors hover:bg-[#6B451D] hover:text-white"
                  aria-label="Close authentication modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-5 pt-5">
              <div className="grid grid-cols-2 border border-[#8A806F]">
                {(["signin", "signup"] as Mode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchMode(item)}
                    className={cn(
                      "px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
                      activeMode === item ? "bg-[#6B451D] text-white" : "bg-transparent text-[#514B42] hover:bg-black/5"
                    )}
                  >
                    {item === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              {isSignup && (
                <Field
                  label="Full name"
                  icon={<User className="h-4 w-4" />}
                  value={name}
                  onChange={setName}
                  error={errors.name}
                  autoComplete="name"
                />
              )}
              <Field
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={setEmail}
                error={errors.email}
                autoComplete="email"
                type="email"
              />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#514B42]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#514B42]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className={cn(
                      "h-12 w-full border border-[#8A806F] bg-[#FAF7F0] pl-10 pr-12 text-sm text-[#211F1C] outline-none transition-colors placeholder:text-[#514B42]/60 focus:border-[#6B451D]"
                    )}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#514B42] transition-colors hover:text-[#211F1C]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-xs text-red-700">{errors.password}</p> : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#6B451D] px-4 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#4E3014] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Please wait" : submitLabel}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>

              <div className="flex items-start gap-3 border border-[#8A806F]/70 bg-white/60 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6B451D]" />
                <p className="text-sm leading-6 text-[#514B42]">
                  Guests can browse, add to cart, and checkout without an account. Sign in only to save orders and shipping details.
                </p>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label = "",
  icon = null,
  value = "",
  onChange = () => undefined,
  error = "",
  type = "text",
  autoComplete = "off",
}: {
  label?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#514B42]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#514B42]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          autoComplete={autoComplete}
          className="h-12 w-full border border-[#8A806F] bg-[#FAF7F0] pl-10 pr-4 text-sm text-[#211F1C] outline-none transition-colors placeholder:text-[#514B42]/60 focus:border-[#6B451D]"
          placeholder={label}
        />
      </div>
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

AuthModal.defaultProps = defaultProps;
Field.defaultProps = {
  label: "",
  icon: null,
  value: "",
  onChange: () => undefined,
  error: "",
  type: "text",
  autoComplete: "off",
};

export default AuthModal;