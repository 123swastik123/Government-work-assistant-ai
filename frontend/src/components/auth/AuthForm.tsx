"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Phone, ArrowRight, AlertCircle, CheckCircle2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NammaMark } from "@/components/brand/NammaMark";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics/events";

type AuthMethod = "email" | "phone";
type Step = "input" | "sent" | "verify_phone";

function AuthFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";

  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [configWarning, setConfigWarning] = useState(false);

  const supabase = createClient();
  const phoneOtpEnabled = process.env.NEXT_PUBLIC_PHONE_OTP_ENABLED === "true";

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

  const sendPhoneOtp = async () => {
    if (!phoneOtpEnabled) return;
    if (configWarning) { toast.error("Sign-in is not configured for this deployment yet."); return; }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) { toast.error("Enter a valid 10-digit Indian mobile number."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: `+91${digits}`, options: { shouldCreateUser: true } });
      if (error) { toast.error(error.message); return; }
      setStep("verify_phone");
      toast.success("A six-digit code was sent to your phone.");
    } catch {
      toast.error("Could not send the sign-in code. Please try again.");
    } finally { setLoading(false); }
  };

  const verifyPhoneOtp = async () => {
    if (otp.length !== 6) { toast.error("Enter the 6-digit code."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: `+91${phone.replace(/\D/g, "")}`, token: otp, type: "sms" });
      if (error) { toast.error("That code is invalid or expired. Request a new one."); return; }
      trackEvent("auth_completed");
      toast.success("Signed in successfully.");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Could not verify the code. Please try again.");
    } finally { setLoading(false); }
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
              : step === "sent" ? "Open the secure link we sent to your email" : "Enter the code sent to your phone"}
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
              {phoneOtpEnabled && (
                <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                  <button type="button" onClick={() => setMethod("email")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${method === "email" ? "bg-brand-500 text-white" : "text-gray-400 hover:text-white"}`}><Mail className="h-3.5 w-3.5" />Email link</button>
                  <button type="button" onClick={() => setMethod("phone")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${method === "phone" ? "bg-brand-500 text-white" : "text-gray-400 hover:text-white"}`}><Phone className="h-3.5 w-3.5" />Phone OTP</button>
                </div>
              )}
              {method === "email" ? <>
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
              <p className="-mt-2 text-xs leading-relaxed text-[#b8d0d2]">We send a secure sign-in link. NammaPath never asks for your Aadhaar, PAN number, government password, or government OTP.</p>

              <Button loading={loading} onClick={sendOTP} className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Email me a secure sign-in link
              </Button>
              </> : <>
                <div><label className="mb-1.5 block text-xs font-medium text-gray-300">Indian mobile number</label><div className="flex gap-2"><span className="flex items-center rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white">+91</span><input type="tel" inputMode="numeric" autoFocus value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} onKeyDown={(event) => event.key === "Enter" && sendPhoneOtp()} placeholder="9876543210" className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500" /></div></div>
                <p className="-mt-2 text-xs leading-relaxed text-[#b8d0d2]">We use this only to send a sign-in code. Never enter an OTP from any government service here.</p>
                <Button loading={loading} onClick={sendPhoneOtp} className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>Send phone sign-in code</Button>
              </>}

              {method === "email" && <div className="relative flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>}

              {method === "email" && <Button
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
              </Button>}

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

          {step === "verify_phone" && (
            <div className="space-y-4"><div className="text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/20"><Phone className="h-6 w-6 text-brand-300" /></div><p className="text-xs text-gray-400">Enter the six-digit code sent to</p><p className="mt-0.5 text-sm font-semibold text-white">+91 {phone}</p></div><input type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(event) => event.key === "Enter" && verifyPhoneOtp()} placeholder="123456" maxLength={6} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-center text-2xl font-bold tracking-[.4em] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500" /><Button loading={loading} disabled={otp.length !== 6} onClick={verifyPhoneOtp} className="w-full" leftIcon={<LogIn className="h-4 w-4" />}>Verify and sign in</Button><div className="flex justify-between pt-1 text-xs"><button onClick={() => { setStep("input"); setOtp(""); }} className="text-gray-400 hover:text-white">← Change number</button><button onClick={sendPhoneOtp} disabled={loading} className="text-brand-300 hover:text-brand-200 disabled:opacity-50">Resend code</button></div></div>
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
