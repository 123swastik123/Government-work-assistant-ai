"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NammaMark } from "@/components/brand/NammaMark";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics/events";

type Step = "input" | "sent";

function AuthFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [configWarning, setConfigWarning] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setConfigWarning(!isSupabaseConfigured());
  }, []);

  const sendOTP = async () => {
    if (configWarning) {
      toast.error("Supabase authentication credentials are not yet configured in .env.local.");
      return;
    }

    if (!email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    trackEvent("auth_started");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setStep("sent");
      toast.success("Secure sign-in link sent to your email.");
    } catch {
      toast.error("Unable to connect to the sign-in service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (configWarning) {
      toast.error("Supabase authentication credentials are not yet configured in .env.local.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } catch {
      toast.error("Google sign in failed. Please check configuration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1326] to-[#0a0f1e] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <NammaMark className="w-16 h-16 mx-auto mb-4 drop-shadow-[0_16px_22px_rgba(35,212,193,.26)]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Namma<span className="text-[#8ef3eb]">Path</span></h1>
          <p className="text-sm text-gray-400 mt-1">
            {step === "input"
              ? "Sign in to save your journeys and bookmarks"
              : "Open the secure link we sent to your email"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl">
          {configWarning && (
            <div className="mb-5 flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Local Configuration Notice</p>
                <p className="mt-0.5 text-amber-400/90 leading-relaxed">
                  Sign-in is not configured for this deployment yet. Guests can still use the platform freely without logging in.
                </p>
              </div>
            </div>
          )}

          {step === "input" && (
            <div className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                  autoFocus
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-brand-500"
                />
              <p className="-mt-2 text-xs leading-relaxed text-[#b8d0d2]">We send a secure sign-in link. NammaPath never asks you to type an OTP, password, Aadhaar, or PAN number.</p>

              <Button loading={loading} onClick={sendOTP} className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Email me a secure sign-in link
              </Button>

              <div className="relative flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <Button
                variant="outline"
                loading={loading}
                onClick={signInWithGoogle}
                className="w-full border-white/20 text-white hover:bg-white/10"
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                }
              >
                Continue with Google
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-xs text-brand-400 hover:text-brand-300 underline transition-colors"
                >
                  Continue as Guest (no login needed) →
                </button>
              </div>
            </div>
          )}

          {step === "sent" && (
            <div className="space-y-4">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-300" />
                </div>
                <p className="text-xs text-gray-400">We sent a secure sign-in link to</p>
                <p className="font-semibold text-white text-sm mt-0.5">
                  {email}
                </p>
              </div>
              <div className="rounded-2xl border border-brand-300/20 bg-brand-500/10 p-4 text-center text-xs leading-relaxed text-[#d7f4f1]">Open the link in the same browser. It signs you in and returns you safely to NammaPath.</div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-brand-400 hover:text-brand-300 disabled:opacity-50 transition-colors"
                >
                  Resend code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthFormInner />
    </Suspense>
  );
}
