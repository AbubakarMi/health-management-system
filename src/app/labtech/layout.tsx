
"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { RouteGuard } from "@/components/auth/route-guard";

export default function LabTechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [welcomeUser, setWelcomeUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const userJson = sessionStorage.getItem('welcomeUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setWelcomeUser(user);
        sessionStorage.removeItem('welcomeUser');
      } catch (e) {
        console.error("Failed to parse welcome user from session storage", e);
      }
    }
  }, []);

  return (
    <RouteGuard requiredRole="labtech">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <AppSidebar role="labtech" />
            <SidebarInset>
                 <div className="flex flex-col min-h-screen">
                    <AppHeader role="Lab Tech" />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t bg-gradient-to-r from-card via-card to-primary/5">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
                          <span className="nubenta-gradient-text font-semibold">Powered by Nubenta Technology</span>
                          <span className="text-xs">© 2025</span>
                        </div>
                    </footer>
                </div>
            </SidebarInset>
        </div>
        {welcomeUser && (
            <WelcomeDialog
                user={welcomeUser}
                isOpen={!!welcomeUser}
                onClose={() => setWelcomeUser(null)}
            />
        )}
      </SidebarProvider>
    </RouteGuard>
  );
}
