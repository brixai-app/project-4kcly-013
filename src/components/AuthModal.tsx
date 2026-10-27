import React, { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "@/lib/auth-client";

export type AuthModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
};

export function AuthModal({ open = false, onOpenChange = () => {}, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  const title = useMemo(() => (tab === "signin" ? "Welcome back" : "Create your account"), [tab]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email?.trim() || !form.password?.trim()) {
      toast.error("Please complete the required fields.");
      return;
    }
    setLoading(true);
    try {
      if (tab === "signin") {
        await signIn?.({ email: form.email.trim(), password: form.password });
        toast.success("Signed in successfully.");
      } else {
        if (!form.name?.trim()) {
          toast.error("Please enter your name.");
          setLoading(false);
          return;
        }
        await signUp?.({ name: form.name.trim(), email: form.email.trim(), password: form.password });
        toast.success("Account created successfully.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 outline-none">
          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] text-[#2B2B2B] shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#C9A66B]/60 px-6 py-5">
                  <div className="min-w-0">
                    <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">{title}</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm leading-6 text-[#6D6257]">
                      Access order continuity, saved details, and artisan story updates.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A66B] text-[#2B2B2B] transition-colors hover:bg-[#B04E2C] hover:text-white"
                      aria-label="Close authentication modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="px-6 pt-5">
                  <div className="grid grid-cols-2 gap-2 rounded-md border border-[#C9A66B]/70 p-1">
                    {(["signin", "signup"] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTab(item)}
                        className={cn(
                          "rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                          tab === item ? "bg-[#B04E2C] text-white" : "text-[#6D6257] hover:bg-black/5"
                        )}
                      >
                        {item === "signin" ? "Sign in" : "Sign up"}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={submit} className="space-y-4 px-6 py-5">
                  {tab === "signup" && (
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6D6257]">
                        <User className="h-4 w-4" /> Full name
                      </span>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        autoComplete="name"
                        className="w-full rounded-md border border-[#C9A66B] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B04E2C]"
                        placeholder="Your name"
                      />
                    </label>
                  )}

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6D6257]">
                      <Mail className="h-4 w-4" /> Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      autoComplete="email"
                      className="w-full rounded-md border border-[#C9A66B] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B04E2C]"
                      placeholder="name@example.com"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6D6257]">
                      <Lock className="h-4 w-4" /> Password
                    </span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      autoComplete={tab === "signin" ? "current-password" : "new-password"}
                      className="w-full rounded-md border border-[#C9A66B] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B04E2C]"
                      placeholder="••••••••"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#B04E2C] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#8F3C22] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Please wait
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        {tab === "signin" ? "Sign in" : "Create account"}
                      </>
                    )}
                  </button>

                  <div className="rounded-md border border-[#C9A66B]/70 bg-black/5 px-4 py-3 text-sm text-[#6D6257]">
                    Secure access for saved carts, order intents, and artisan updates.
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AuthModal;