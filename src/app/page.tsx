
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
import { LogIn, Shield, AlertTriangle, Sparkles, Lock, Mail, Eye, EyeOff, Heart, Stethoscope, Activity, Zap, Star, Users, Award, Globe, ArrowRight } from 'lucide-react';

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
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const authenticatedUser = authManager.login(email, password);
    
    if (authenticatedUser) {
      // Store user info in session storage for backward compatibility
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('welcomeUser', JSON.stringify({
            name: authenticatedUser.name,
            role: roleNames[authenticatedUser.role],
        }));
      }
      
      toast({
        title: "✨ Welcome Back!",
        description: `Hello ${authenticatedUser.name}! Redirecting to your secure dashboard...`,
      });
      
      // Redirect with security check
      setTimeout(() => {
        router.push(`/${authenticatedUser.role}`);
      }, 1000);
    } else {
      toast({
        variant: "destructive",
        title: "🔐 Access Denied",
        description: "Invalid credentials. Please verify your email and password.",
      });
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary floating orbs */}
        <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-gradient-to-r from-teal-400/30 via-cyan-500/30 to-emerald-400/25 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-gradient-to-l from-cyan-400/25 via-teal-500/25 to-emerald-500/25 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-80 h-80 bg-gradient-to-r from-emerald-400/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float [animation-delay:4s]"></div>
        
        {/* Medical icons floating */}
        <div className="absolute top-[15%] left-[15%] animate-float [animation-delay:1s]">
          <Heart className="w-8 h-8 text-red-400/40" />
        </div>
        <div className="absolute top-[25%] right-[20%] animate-float [animation-delay:3s]">
          <Stethoscope className="w-10 h-10 text-blue-400/40" />
        </div>
        <div className="absolute bottom-[30%] left-[20%] animate-float [animation-delay:5s]">
          <Activity className="w-6 h-6 text-green-400/40" />
        </div>
        <div className="absolute top-[60%] right-[15%] animate-float [animation-delay:2.5s]">
          <Zap className="w-7 h-7 text-yellow-400/40" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Side - Hero Section */}
          <div className="flex-1 text-white space-y-6 lg:space-y-8 text-center lg:text-left animate-fade-in-up">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Online & Secure</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Careflux
                </span>
                <span className="block text-xl md:text-2xl lg:text-3xl text-white/80 font-normal mt-2">
                  Healthcare Revolution
                </span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-lg leading-relaxed">
                Transform your healthcare facility with our AI-powered management system. 
                Streamline operations, enhance patient care, and boost efficiency.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-white/80">Patient Management</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-white/80">Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-white/80">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-white/80">Cloud-Based</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-white/60">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/60">Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-white/60">Patients</div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Login Form */}
          <div className="w-full max-w-md animate-fade-in-up [animation-delay:0.3s]">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-8 pb-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-500"></div>
                
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl shadow-lg animate-glow">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                    <p className="text-white/70 text-sm">Sign in to your healthcare dashboard</p>
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
                        placeholder="doctor@hospital.com" 
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
                        <span>Access Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                  
                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white/60">256-bit SSL encrypted connection</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 animate-fade-in [animation-delay:0.9s]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-sm text-white/60 mb-2">
              <span>© 2025</span>
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">
                Nubenta Technology
              </span>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <span>All rights reserved</span>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-400" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
