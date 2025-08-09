
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { IncomingCallDialog } from "@/components/incoming-call-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
