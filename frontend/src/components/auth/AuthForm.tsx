"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Mail, Phone, LogIn, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics/events";
import { useApp } from "@/components/providers";

type AuthMethod = "email" | "phone";
type Step = "input" | "verify";

function AuthFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";
  const { guestProfile, updateGuestProfile } = useApp();

  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [configWarning, setConfigWarning] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project-id")) {
      setConfigWarning(true);
    }
  }, []);

  const sendOTP = async () => {
    if (configWarning) {
      toast.error("Supabase authentication credentials are not yet configured in .env.local.");
      return;
    }

    if (method === "email") {
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
          options: { shouldCreateUser: true },
        });
        if (error) {
          toast.error(error.message);
        } else {
          setStep("verify");
          toast.success("Check your email for a 6-digit code");
        }
      } catch {
        toast.error("Unable to connect to auth service. Please check configuration.");
      } finally {
        setLoading(false);
      }
    } else {
      // Phone OTP
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        toast.error("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      const formattedPhone = `+91${cleanPhone}`;
      setLoading(true);
      trackEvent("auth_started");
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: { shouldCreateUser: true },
        });
        if (error) {
          toast.error(error.message);
        } else {
          setStep("verify");
          toast.success(`Check your phone ${formattedPhone} for a 6-digit code`);
        }
      } catch {
        toast.error("Unable to connect to auth service. Please check configuration.");
      } finally {
        setLoading(false);
      }
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }
    setLoading(true);
    try {
      let data, error;
      if (method === "email") {
        const res = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otp.trim(),
          type: "email",
        });
        data = res.data;
        error = res.error;
      } else {
        const formattedPhone = `+91${phone.replace(/\D/g, "")}`;
        const res = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp.trim(),
          type: "sms",
        });
        data = res.data;
        error = res.error;
      }

      if (error) {
        setLoading(false);
        toast.error("Invalid or expired code. Please try again.");
        return;
      }

      // Migrate guest profile to user profile
      if (data?.user && guestProfile) {
        try {
          await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: guestProfile.language,
              age_bracket: guestProfile.age_bracket,
              category: guestProfile.category,
            }),
          });
          updateGuestProfile({ ...guestProfile });
        } catch {
          // Non-fatal
        }
      }

      trackEvent("auth_completed");
      setLoading(false);
      toast.success("Signed in successfully!");
      router.push(redirectTo);
      router.refresh();
    } catch {
      setLoading(false);
      toast.error("Verification failed. Please try again.");
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
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Government Work Helper</h1>
          <p className="text-sm text-gray-400 mt-1">
            {step === "input"
              ? "Sign in to save your journeys and bookmarks"
              : `Enter the code sent to your ${method === "email" ? "email" : "phone"}`}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl">
          {configWarning && (
            <div className="mb-5 flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Local Configuration Notice</p>
                <p className="mt-0.5 text-amber-400/90 leading-relaxed">
                  Supabase URL and API keys are using placeholder values in .env.local. Guests can use the entire platform freely without logging in.
                </p>
              </div>
            </div>
          )}

          {step === "input" && (
            <div className="space-y-4">
              {/* Auth Method Selector Tabs */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                    method === "email"
                      ? "bg-brand-500 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("phone")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                    method === "phone"
                      ? "bg-brand-500 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Phone OTP (+91)
                </button>
              </div>

              {method === "email" ? (
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
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                      placeholder="9876543210"
                      maxLength={10}
                      autoFocus
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              <Button loading={loading} onClick={sendOTP} className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Send sign-in code
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

          {step === "verify" && (
            <div className="space-y-4">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  {method === "email" ? <Mail className="w-6 h-6 text-brand-400" /> : <Phone className="w-6 h-6 text-brand-400" />}
                </div>
                <p className="text-xs text-gray-400">
                  We sent a 6-digit code to
                </p>
                <p className="font-semibold text-white text-sm mt-0.5">
                  {method === "email" ? email : `+91 ${phone}`}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2 text-center">
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
                  className="w-full text-center text-2xl font-bold tracking-[0.4em] bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              <Button
                loading={loading}
                onClick={verifyOTP}
                className="w-full mt-2"
                disabled={otp.length !== 6}
                leftIcon={otp.length === 6 ? <Check className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              >
                Verify & sign in
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setStep("input"); setOtp(""); }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Change {method}
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
