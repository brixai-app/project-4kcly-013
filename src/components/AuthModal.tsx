import React from 'react';
import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Lock, Mail, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "@/lib/auth-client";

type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
};

const inputBase =
  "w-full rounded-sm border border-[#CDBB9D] bg-[#FFFDFC] px-3 py-2.5 text-sm text-[#211A17] outline-none transition placeholder:text-[#6F6258]/70 focus:border-[#741F2B]";

export function AuthModal({ open = false, onOpenChange = () => {}, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => setTab(defaultTab), [defaultTab, open]);
  useEffect(() => {
    if (!open) {
      setErrors({});
      setPending(false);
      setShowPassword(false);
    }
  }, [open]);

  const title = useMemo(() => (tab === "signin" ? "Welcome back" : "Create your account"), [tab]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (tab === "signup" && !form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.password.trim()) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || pending) return;
    setPending(true);
    try {
      const session =
        tab === "signin"
          ? await signIn({ email: form.email, password: form.password })
          : await signUp({ name: form.name, email: form.email, password: form.password });
      if (session) {
        toast.success(tab === "signin" ? "Signed in successfully." : "Account created successfully.");
        onOpenChange(false);
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-[#211A17]/60 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#CDBB9D] bg-[#F7F0E3] p-4 shadow-[0_24px_80px_rgba(33,26,23,0.22)]"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-['Bodoni_Moda'] text-2xl leading-none text-[#211A17]">{title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F6258]">
                      Authentic Jodhpuri Mojris
                    </p>
                  </div>
                  <Dialog.Close className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#CDBB9D] text-[#211A17] transition hover:bg-[#741F2B] hover:text-white">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-sm border border-[#CDBB9D] bg-[#FFFDFC] p-1">
                  {(["signin", "signup"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={cn(
                        "rounded-sm px-3 py-2 text-xs uppercase tracking-[0.22em] transition",
                        tab === item ? "bg-[#741F2B] text-white" : "text-[#6F6258] hover:text-[#211A17]"
                      )}
                    >
                      {item === "signin" ? "Sign In" : "Register"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  {tab === "signup" && (
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-[#6F6258]">Name</label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6258]" />
                        <input
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className={cn(inputBase, "pl-10")}
                          placeholder="Your full name"
                          autoComplete="name"
                        />
                      </div>
                      {errors.name ? <p className="mt-1 text-xs text-[#741F2B]">{errors.name}</p> : null}
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-[#6F6258]">Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6258]" />
                      <input
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className={cn(inputBase, "pl-10")}
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email ? <p className="mt-1 text-xs text-[#741F2B]">{errors.email}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-[#6F6258]">Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6258]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        className={cn(inputBase, "pl-10 pr-10")}
                        placeholder="••••••••"
                        autoComplete={tab === "signin" ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-[#6F6258] transition hover:bg-[#F7F0E3] hover:text-[#211A17]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password ? <p className="mt-1 text-xs text-[#741F2B]">{errors.password}</p> : null}
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#741F2B] px-4 py-3 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#561620] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border border-white/40 border-t-white" />
                        Please wait
                      </>
                    ) : (
                      <>
                        {tab === "signin" ? "Sign In" : "Create Account"}
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
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