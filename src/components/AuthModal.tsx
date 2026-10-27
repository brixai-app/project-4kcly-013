import React, { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "@/lib/auth-client";

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: "sign-in" | "sign-up";
};

export function AuthModal({
  open = false,
  onOpenChange = () => {},
  defaultMode = "sign-in",
}: AuthModalProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setError("");
    }
  }, [open, defaultMode]);

  const title = useMemo(() => (mode === "sign-in" ? "Welcome back" : "Create account"), [mode]);
  const subtitle = useMemo(
    () =>
      mode === "sign-in"
        ? "Sign in to manage your orders, wishlist, and checkout."
        : "Join Jootiya for a refined, faster checkout experience.",
    [mode]
  );

  const updateField = (key: "name" | "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");

    try {
      if (!form.email?.trim() || !form.password?.trim()) throw new Error("Email and password are required.");
      if (mode === "sign-up" && !form.name?.trim()) throw new Error("Full name is required.");
      const payload =
        mode === "sign-in"
          ? { email: form.email.trim(), password: form.password }
          : { name: form.name.trim(), email: form.email.trim(), password: form.password };
      const result = mode === "sign-in" ? await signIn(payload) : await signUp(payload);
      if ((result as { error?: string } | null)?.error) throw new Error((result as { error?: string })?.error ?? "Authentication failed.");
      toast.success(mode === "sign-in" ? "Signed in successfully." : "Account created successfully.");
      onOpenChange(false);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 border border-[#D8CBBB] bg-[#FFFDFC] p-5 text-[#2B2B2B] shadow-[0_24px_80px_rgba(0,0,0,0.18)] outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight">{title}</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-[#6D6259]">{subtitle}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#D8CBBB] text-[#2B2B2B] transition-colors hover:bg-[#F9F5F0]"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 grid grid-cols-2 border border-[#D8CBBB] text-xs font-semibold uppercase tracking-[0.22em]">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={cn(
                "border-r border-[#D8CBBB] px-3 py-3 transition-colors",
                mode === "sign-in" ? "bg-[#BFA06E] text-black" : "bg-transparent text-[#6D6259] hover:bg-[#F9F5F0]"
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={cn(
                "px-3 py-3 transition-colors",
                mode === "sign-up" ? "bg-[#BFA06E] text-black" : "bg-transparent text-[#6D6259] hover:bg-[#F9F5F0]"
              )}
            >
              Sign up
            </button>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" && (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6D6259]">Full name</span>
                <div className="flex items-center gap-3 border border-[#D8CBBB] bg-white px-3 py-3">
                  <User className="h-4 w-4 shrink-0 text-[#6D6259]" />
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    type="text"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#A79A8E]"
                    placeholder="Your name"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6D6259]">Email address</span>
              <div className="flex items-center gap-3 border border-[#D8CBBB] bg-white px-3 py-3">
                <Mail className="h-4 w-4 shrink-0 text-[#6D6259]" />
                <input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  type="email"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#A79A8E]"
                  placeholder="name@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#6D6259]">Password</span>
              <div className="flex items-center gap-3 border border-[#D8CBBB] bg-white px-3 py-3">
                <Lock className="h-4 w-4 shrink-0 text-[#6D6259]" />
                <input
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#A79A8E]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="inline-flex h-8 w-8 items-center justify-center text-[#6D6259] transition-colors hover:text-[#2B2B2B]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error ? (
              <div className="border border-[#D8CBBB] bg-[#F9F5F0] px-3 py-3 text-sm text-[#2B2B2B]" role="alert">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#BFA06E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#A88650] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Please wait" : mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;