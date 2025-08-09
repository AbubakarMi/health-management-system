
"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { IncomingCallDialog } from "@/components/incoming-call-dialog";

export const CallContext = React.createContext({
  isReceivingCall: false,
  setIsReceivingCall: (isReceiving: boolean) => {},
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReceivingCall, setIsReceivingCall] = useState(false);

  useEffect(() => {
    // Automatically simulate a call at random intervals (e.g., between 30s and 90s)
    let callTimeout: NodeJS.Timeout;

    const scheduleNextCall = () => {
        const randomInterval = Math.random() * 60000 + 30000; // 30s to 90s
        callTimeout = setTimeout(() => {
            // Only trigger a new call if one isn't already active
            if (!isReceivingCall) {
                setIsReceivingCall(true);
            }
            scheduleNextCall();
        }, randomInterval);
    };

    scheduleNextCall();

    return () => clearTimeout(callTimeout);
  }, [isReceivingCall]); // Rerun effect if isReceivingCall changes


  return (
    <CallContext.Provider value={{ isReceivingCall, setIsReceivingCall }}>
      <SidebarProvider>
          <div className="flex min-h-screen w-full">
              <AppSidebar role="admin" />
              <SidebarInset>
                  <div className="flex flex-col min-h-screen">
                      <AppHeader role="Admin" />
                      <main className="flex-1 p-4 md:p-6 lg:p-8">
                          {children}
                      </main>
                      <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
                          Powered by DevFlux 2025
                      </footer>
                  </div>
              </SidebarInset>
          </div>
          <IncomingCallDialog
            isOpen={isReceivingCall}
            onClose={() => setIsReceivingCall(false)}
          />
      </SidebarProvider>
    </CallContext.Provider>
  );
}
