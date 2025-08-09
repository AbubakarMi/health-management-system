
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Phone } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (user && user.password === password) {
      router.push(`/${user.role}`);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  const handleEmergencyCall = () => {
    // In a real app, this would use a telephony service.
    // Here, we'll simulate it by setting a flag in localStorage for the admin page to pick up.
    localStorage.setItem('incomingCall', 'true');
    toast({
      title: "Placing Emergency Call",
      description: "You are being connected. Please log in as an admin on this or another device to see the call.",
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
       <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(var(--primary-rgb),0.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(var(--primary-rgb),0.15),rgba(255,255,255,0))]"></div>
       </div>

      <div className="z-10 text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground animate-fade-in-up">
          Welcome to <span className="text-primary-foreground bg-primary/90 px-2 rounded-md">Careflux</span>
        </h1>
        <p className="text-muted-foreground mt-4 text-base md:text-lg animate-fade-in-up [animation-delay:0.2s]">Your integrated hospital management solution.</p>
      </div>
      <Card className="w-full max-w-sm animate-fade-in-up [animation-delay:0.4s]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2 animate-fade-in-up [animation-delay:0.5s]">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2 animate-fade-in-up [animation-delay:0.6s]">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full animate-fade-in-up [animation-delay:0.7s]">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Button
        variant="destructive"
        size="lg"
        className="mt-6 animate-fade-in-up [animation-delay:0.8s] z-10"
        onClick={handleEmergencyCall}
      >
        <Phone className="mr-2 h-5 w-5" />
        Emergency Call
      </Button>

      <footer className="z-10 mt-12 text-center text-sm text-muted-foreground animate-fade-in [animation-delay:0.9s]">
        <p>Powered by DevFlux 2025</p>
      </footer>
    </div>
  );
}
