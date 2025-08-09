
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Phone, LogIn } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    // In a real app, this would be triggered by a telephony service.
    // Here, we'll simulate it by setting a flag in localStorage for the admin page to pick up.
    localStorage.setItem('incomingCall', 'true');
    toast({
      title: "Simulating Call",
      description: "An incoming emergency call is being simulated for any logged-in administrator.",
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
      
      <div className="grid md:grid-cols-2 gap-8 z-10 w-full max-w-4xl">
        <Card className="w-full animate-fade-in-up [animation-delay:0.4s]">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><LogIn className="w-6 h-6"/> Staff Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full animate-fade-in-up [animation-delay:0.6s] bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-destructive"><Phone className="w-6 h-6"/> Emergency Line</CardTitle>
            <CardDescription className="text-destructive/80">
              For immediate medical emergencies, please call the number below.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold font-mono tracking-wider text-foreground">
              +234 706 916 3505
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              (This is the official hospital emergency number)
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-2">
             <Separator className="bg-destructive/20"/>
             <p className="text-sm text-muted-foreground pt-2">To test the system, you can simulate a call:</p>
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={handleEmergencyCall}
            >
              <Phone className="mr-2 h-5 w-5" />
              Simulate Calling this Number
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="z-10 mt-12 text-center text-sm text-muted-foreground animate-fade-in [animation-delay:0.9s]">
        <p>Powered by DevFlux 2025</p>
      </footer>
    </div>
  );
}
