"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ORG_TYPES = [
  { value: "NGO", label: "NGO", icon: "🏛️", desc: "Non-Governmental Organization" },
  { value: "CSO", label: "CSO", icon: "🤝", desc: "Civil Society Organization" },
  { value: "GOVERNMENT", label: "Government", icon: "🏢", desc: "Government Agency" },
  { value: "FUNDER", label: "Funder", icon: "💰", desc: "Foundation / Funding Body" },
  { value: "OTHER", label: "Other", icon: "🌐", desc: "Other Organization Type" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationType: "NGO",
    state: "",
    district: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (!formData.organizationName) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">🏫</span>
            <h1 className="text-3xl font-bold text-white">Pathshala</h1>
          </div>
          <p className="text-teal-100 text-lg">Design Studio for Education Programs</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">AI-Powered Design</h3>
              <p className="text-teal-100 text-sm">Get intelligent suggestions for your program objectives</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">SMART Validation</h3>
              <p className="text-teal-100 text-sm">Ensure your outcomes are measurable and achievable</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Gamified Journey</h3>
              <p className="text-teal-100 text-sm">Learn best practices while designing your program</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-teal-100 text-sm">
          Trusted by 100+ organizations across India
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🏫</span>
            <h1 className="text-2xl font-bold text-slate-800 mt-2">Pathshala Design Studio</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-teal-600" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-teal-600 text-white" : "bg-slate-200"}`}>
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Account</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-teal-600" : "bg-slate-200"}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-teal-600" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-teal-600 text-white" : "bg-slate-200"}`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Organization</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {step === 1 ? "Create your account" : "Organization details"}
              </h2>
              <p className="text-slate-500 mt-1">
                {step === 1 ? "Start your program design journey" : "Tell us about your organization"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@organization.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Teach For India"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Organization Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ORG_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, organizationType: type.value })}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            formData.organizationType === type.value
                              ? "border-teal-500 bg-teal-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xl">{type.icon}</span>
                          <p className={`text-sm font-medium mt-1 ${
                            formData.organizationType === type.value ? "text-teal-700" : "text-slate-700"
                          }`}>{type.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        State <span className="text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Maharashtra"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        District <span className="text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Mumbai"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-medium hover:from-teal-700 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${step === 1 ? "w-full" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : step === 1 ? (
                    "Continue →"
                  ) : (
                    "Create Account 🚀"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-teal-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
