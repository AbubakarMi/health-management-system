"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ambulance } from "lucide-react";

const AmbulanceSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary drop-shadow-lg">
        <path d="M10 10H6" />
        <path d="M8 8V12" />
        <path d="M9 17H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1Z" />
        <path d="M19.42 17.42 18 16" />
        <path d="m22 19-1.42-1.42" />
        <path d="M18 22v-3.42" />
        <path d="M22 16h-3.42" />
        <path d="M2 8h10" />
        <path d="M17 17.5c.62.62 1.64.62 2.26 0l.54-.54c.62-.62.62-1.64 0-2.26l-1.8-1.8a1.6 1.6 0 0 0-2.26 0l-.54.54c-.62.62-.62 1.64 0 2.26Z" />
        <path d="M7 17v4" />
        <path d="M17 17v4" />
        <path d="M22 5h-5" />
        <path d="M19 2v6" />
        <path d="M2 17h2" />
        <path d="m11 8-3-3-3 3" />
        <path d="M12 2h-2v4h4V2h-2Z" />
    </svg>
);

export default function AmbulancePage() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Ambulance className="w-6 h-6" />
            <div>
                <CardTitle>Ambulance Tracking</CardTitle>
                <CardDescription>Live tracking and dispatch of available ambulances.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/30 relative p-8">
         <div className="absolute inset-x-0 bottom-1/4 h-1 bg-border/50"></div>
         <div className="absolute inset-x-0 bottom-1/4 h-12 bg-gradient-to-t from-muted/50 to-transparent"></div>

         <div className="absolute bottom-1/4 left-0 animate-drive">
            <AmbulanceSvg />
         </div>

         <div className="z-10 text-center bg-background/80 p-6 rounded-lg shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold font-headline text-primary">Coming Soon!</h2>
            <p className="text-muted-foreground mt-2">
                This live ambulance tracking and dispatch module is currently under development.
            </p>
         </div>
         
         <style jsx>{`
            @keyframes drive {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(calc(100vw - 120px)); }
            }
            .animate-drive {
                animation: drive 10s linear infinite;
            }
         `}</style>
      </CardContent>
    </Card>
  );
}
