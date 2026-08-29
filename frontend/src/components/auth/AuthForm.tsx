"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Mail, LogIn, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics/events";
import { useApp } from "@/components/providers";

type Step = "enter_email" | "enter_otp";

function AuthFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const { guestProfile, updateGuestProfile } = useApp();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("enter_email");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const sendOTP = async () => {
    if (!email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    trackEvent("auth_started");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setStep("enter_otp");
      toast.success("Check your email for a 6-digit code");
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "email",
    });
    if (error) {
      setLoading(false);
      toast.error("Invalid or expired code. Try again.");
      return;
    }

    // Migrate guest session data to the authenticated profile
    if (data.user && guestProfile) {
      try {
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language:    guestProfile.language,
            age_bracket: guestProfile.age_bracket,
            category:    guestProfile.category,
          }),
        });
        // Keep guest answers in local state — they carry forward
        updateGuestProfile({ ...guestProfile });
      } catch {
        // Non-fatal — profile migration failure is acceptable
      }
    }

    trackEvent("auth_completed");
    setLoading(false);
    toast.success("Signed in successfully!");
    router.push(redirectTo);
    router.refresh();
  };

  const signInWithGoogle = async () => {
    setLoading(true);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1326] to-[#0a0f1e] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-brand-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Government Work Helper</h1>
          <p className="text-sm text-gray-400 mt-1">
            {step === "enter_email"
              ? "Sign in to save your progress"
              : "Check your email for the code"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6 sm:p-8">

          {step === "enter_email" && (
            <div className="space-y-4">
              {/* Guest info */}
              {(guestProfile.language !== "en" || guestProfile.age_bracket || guestProfile.category) && (
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 text-sm text-brand-300">
                  <p className="font-medium mb-1">✓ Your preferences will be saved</p>
                  <p className="text-xs text-brand-400">Language, age group, and category will carry over.</p>
                </div>
              )}

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
              <Button loading={loading} onClick={sendOTP} className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Send sign-in code
              </Button>

              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500">or</span>
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

              <p className="text-xs text-center text-gray-500 leading-relaxed pt-2">
                You can also use Government Work Helper as a guest —
                no sign-in required for guidance.{" "}
                <button onClick={() => router.push("/")} className="text-brand-400 hover:text-brand-300 underline">
                  Continue as guest
                </button>
              </p>
            </div>
          )}

          {step === "enter_otp" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-brand-400" />
                </div>
                <p className="text-sm text-gray-300">
                  We sent a 6-digit code to
                </p>
                <p className="font-semibold text-white mt-0.5">{email}</p>
              </div>

              {/* OTP boxes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
                  placeholder="123456"
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>

              <Button
                loading={loading}
                onClick={verifyOTP}
                className="w-full"
                disabled={otp.length !== 6}
                leftIcon={otp.length === 6 ? <Check className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              >
                Verify & sign in
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => { setStep("enter_email"); setOtp(""); }}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← Different email
                </button>
                <button
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
