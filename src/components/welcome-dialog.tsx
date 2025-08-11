
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, ArrowRight } from "lucide-react";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    role: string;
  };
}

export function WelcomeDialog({ isOpen, onClose, user }: WelcomeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center p-8">
        <DialogHeader>
            <div className="flex flex-col items-center">
                <div className="p-4 bg-green-500/10 rounded-full mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5}/>
                </div>
                <DialogTitle className="text-2xl font-bold font-headline text-foreground">Login Successful</DialogTitle>
                <p className="text-muted-foreground mt-2 text-lg">
                    Welcome, {user.role}
                </p>
                <p className="font-semibold text-2xl text-foreground mt-1">
                    {user.name}
                </p>
            </div>
        </DialogHeader>
        <DialogFooter className="mt-6">
            <Button onClick={onClose} className="w-full" size="lg">
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
