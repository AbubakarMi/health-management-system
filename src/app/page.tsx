
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
import { LogIn, Shield, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const authenticatedUser = authManager.login(email, password);
    
    if (authenticatedUser) {
      // Store user info in session storage for backward compatibility
      sessionStorage.setItem('welcomeUser', JSON.stringify({
          name: authenticatedUser.name,
          role: roleNames[authenticatedUser.role],
      }));
      
      toast({
        title: "🎉 Login Successful!",
        description: `Welcome back, ${authenticatedUser.name}! Redirecting to your secure dashboard...`,
      });
      
      // Redirect with security check
      setTimeout(() => {
        router.push(`/${authenticatedUser.role}`);
      }, 1000);
    } else {
      toast({
        variant: "destructive",
        title: "🔒 Access Denied",
        description: "Invalid credentials. Please verify your email and password.",
      });
    }
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 overflow-hidden">
       <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-r from-teal-400/25 via-cyan-400/25 to-blue-500/25 blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-l from-blue-500/25 via-cyan-400/25 to-teal-400/25 blur-3xl animate-float [animation-delay:3s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-teal-300/15 via-cyan-300/15 to-blue-300/15 blur-2xl animate-pulse-slow"></div>
       </div>

      <div className="z-10 text-center mb-8 md:mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-2xl mb-4 animate-glow">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-lg"></div>
            </div>
          </div>
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-2 animate-fade-in-up">
          <span className="nubenta-gradient-text">Careflux</span>
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white rounded-full text-sm font-semibold mb-4 animate-fade-in-up [animation-delay:0.1s]">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Powered by Nubenta Technology
        </div>
        <p className="text-muted-foreground mt-4 text-lg md:text-xl font-medium animate-fade-in-up [animation-delay:0.2s]">
          World-Class Hospital Management System
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm text-muted-foreground animate-fade-in-up [animation-delay:0.3s]">
          <span className="px-3 py-1 bg-primary/10 rounded-full">AI-Powered</span>
          <span className="px-3 py-1 bg-accent/10 rounded-full">Cloud-Ready</span>
          <span className="px-3 py-1 bg-secondary/10 rounded-full">Enterprise-Grade</span>
        </div>
      </div>
      
      <div className="z-10 w-full max-w-md flex flex-col gap-6">
        <Card className="animate-fade-in-up [animation-delay:0.4s] border-0 shadow-2xl bg-card/50 backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl flex items-center justify-center gap-2 font-headline">
              <div className="p-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-lg">
                <Shield className="w-5 h-5 text-white"/>
              </div>
              Secure Access Portal
            </CardTitle>
            <CardDescription className="text-base">
                Role-based authentication with enterprise-grade security
            </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@hospital.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
                    />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:from-teal-500 hover:via-cyan-500 hover:to-blue-600 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                    Access Dashboard
                </Button>
                </div>
            </form>
            </CardContent>
        </Card>
      </div>

     <footer className="z-10 mt-12 text-center animate-fade-in [animation-delay:0.9s]">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <div className="w-1 h-1 bg-primary rounded-full"></div>
          <span>© 2025</span>
          <div className="w-1 h-1 bg-primary rounded-full"></div>
          <span className="nubenta-gradient-text font-semibold">Nubenta Technology</span>
          <div className="w-1 h-1 bg-primary rounded-full"></div>
        </div>
        <p className="text-xs text-muted-foreground">
          Revolutionizing Healthcare Management Systems Worldwide
        </p>
      </footer>
    </div>
  );
}
