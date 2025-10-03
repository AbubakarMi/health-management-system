"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { users, roleNames } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { authManager } from '@/lib/auth';
import { LogIn, Shield, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const authenticatedUser = authManager.login(email, password);

    if (authenticatedUser) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('welcomeUser', JSON.stringify({
            name: authenticatedUser.name,
            role: roleNames[authenticatedUser.role],
        }));
      }

      toast({
        title: "Welcome Back!",
        description: `Hello ${authenticatedUser.name}! Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        router.push(`/${authenticatedUser.role}`);
      }, 1000);
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid credentials. Please contact your system administrator.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-gradient-to-r from-teal-400/30 via-cyan-500/30 to-emerald-400/25 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-gradient-to-l from-cyan-400/25 via-teal-500/25 to-emerald-500/25 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-80 h-80 bg-gradient-to-r from-emerald-400/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float [animation-delay:4s]"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative p-8 pb-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-500"></div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Staff Login</h2>
                  <p className="text-white/70 text-sm">Access your healthcare dashboard</p>
                  <p className="text-white/50 text-xs mt-2">Users are created by administrators only</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@hospital.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 pr-4 bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 rounded-xl"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-4 top-4 w-4 h-4 text-white/60 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 pr-12 bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 rounded-xl"
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-4 top-4 w-4 h-4 text-white/60 group-focus-within:text-cyan-400 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 w-4 h-4 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-600 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-500 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-xl border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-white/60">Secure encrypted connection</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
