import React, { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, X } from 'lucide-react';
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: AuthMode;
  redirectTo?: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginRoute() {
  return null;
}

export function AuthModal({
  open = false,
  onOpenChange = () => {},
  defaultMode = "signin",
  redirectTo = "/",
}: AuthModalProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setErrors({});
      setAnnouncement("");
    }
  }, [open, defaultMode]);

  const title = useMemo(() => (mode === "signin" ? "Sign in" : "Create account"), [mode]);

  const validate = () => {
    const next: FieldErrors = {};
    if (mode === "signup" && !name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!emailPattern.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password.trim()) next.password = "Password is required.";
    else if (password.trim().length < 8) next.password = "Use at least 8 characters.";
    if (mode === "signup" && password !== confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setErrors({});
    setAnnouncement("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setPending(true);
    setAnnouncement("");
    try {
      const payload = { email: email.trim(), password: password.trim() };
      const result =
        mode === "signin"
          ? await signIn(payload)
          : await signUp({ ...payload, name: name.trim() });
      if (result?.error) throw new Error(result.error);
      setAnnouncement(mode === "signin" ? "Signed in successfully." : "Account created successfully.");
      toast.success(mode === "signin" ? "Welcome back." : "Account created.");
      resetForm();
      onOpenChange(false);
      navigate(redirectTo ?? "/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      setAnnouncement(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 border border-[#CFC1AD] bg-[#FFFCF6] p-5 text-[#2E2E2E] shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Playfair_Display'] text-3xl font-medium tracking-tight">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 font-['Lora'] text-sm leading-6 text-[#6F675D]">
                Access your Jootiya account to track orders, save favorites, and complete checkout.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#CFC1AD] text-[#2E2E2E] transition-colors hover:bg-[#8B0000] hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-2 border border-[#CFC1AD]">
            {(["signin", "signup"] as AuthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  "px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition-colors",
                  mode === item ? "bg-[#8B0000] text-white" : "bg-transparent text-[#6F675D] hover:bg-[#faf9f6]"
                )}
              >
                {item === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675D]">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full border border-[#CFC1AD] bg-white px-3 py-2 font-['Lora'] text-sm outline-none transition-colors placeholder:text-[#9b9183] focus:border-[#8B0000]",
                    errors.name ? "border-[#8B0000]" : ""
                  )}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.name && <p className="mt-1 text-xs text-[#8B0000]">{errors.name}</p>}
              </label>
            )}

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675D]">
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full border border-[#CFC1AD] bg-white px-3 py-2 font-['Lora'] text-sm outline-none transition-colors placeholder:text-[#9b9183] focus:border-[#8B0000]",
                  errors.email ? "border-[#8B0000]" : ""
                )}
                placeholder="name@example.com"
                autoComplete="email"
                type="email"
              />
              {errors.email && <p className="mt-1 text-xs text-[#8B0000]">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675D]">
                <Lock className="h-3.5 w-3.5" />
                Password
              </span>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full border border-[#CFC1AD] bg-white px-3 py-2 pr-11 font-['Lora'] text-sm outline-none transition-colors placeholder:text-[#9b9183] focus:border-[#8B0000]",
                    errors.password ? "border-[#8B0000]" : ""
                  )}
                  placeholder="At least 8 characters"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-[#6F675D] transition-colors hover:text-[#2E2E2E]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-[#8B0000]">{errors.password}</p>}
            </label>

            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675D]">Confirm password</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "w-full border border-[#CFC1AD] bg-white px-3 py-2 font-['Lora'] text-sm outline-none transition-colors placeholder:text-[#9b9183] focus:border-[#8B0000]",
                    errors.confirmPassword ? "border-[#8B0000]" : ""
                  )}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  type="password"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-[#8B0000]">{errors.confirmPassword}</p>}
              </label>
            )}

            {announcement && (
              <div className="flex items-start gap-2 border border-[#CFC1AD] bg-[#faf9f6] px-3 py-2 text-sm text-[#2E2E2E]">
                {announcement.toLowerCase().includes("success") ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#8B0000]" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 text-[#8B0000]" />
                )}
                <p className="font-['Lora']">{announcement}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#8B0000] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#650000] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Please wait" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;