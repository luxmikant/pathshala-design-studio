"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-400 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">🏫</span>
            <h1 className="text-3xl font-bold text-white">Pathshala</h1>
          </div>
          <p className="text-purple-100 text-lg">Design Studio for Education Programs</p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <p className="text-white font-medium">What our users say</p>
                <div className="flex text-yellow-300">★★★★★</div>
              </div>
            </div>
            <p className="text-purple-100 italic">
              "Pathshala transformed how we design education programs. The AI suggestions and SMART validation saved us weeks of work!"
            </p>
            <p className="text-white/80 text-sm mt-3">— Program Manager, Leading NGO</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">100+</p>
            <p className="text-purple-200 text-sm">Organizations</p>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-purple-200 text-sm">Programs Designed</p>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">50M+</p>
            <p className="text-purple-200 text-sm">Students Impacted</p>
          </div>
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

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Welcome back!</h2>
              <p className="text-slate-500 mt-1">Sign in to continue your journey</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                <span className="text-emerald-500 text-xl">✅</span>
                <p className="text-emerald-600 text-sm">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@organization.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium hover:from-violet-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in →"
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">New to Pathshala?</span>
                </div>
              </div>

              <Link 
                href="/auth/register"
                className="mt-4 w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Create an account <span>🚀</span>
              </Link>
            </div>
          </div>

          {/* Test Account Info */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm font-medium mb-2">🧪 Test Account</p>
            <p className="text-amber-700 text-xs">Email: test@example.com</p>
            <p className="text-amber-700 text-xs">Password: Test@123456</p>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Protected by industry-standard security
          </p>
        </div>
      </div>
    </div>
  );
}
