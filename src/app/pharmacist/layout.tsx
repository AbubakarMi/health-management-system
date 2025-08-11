
"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WelcomeDialog } from "@/components/welcome-dialog";

export default function PharmacistLayout({
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
    <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <AppSidebar role="pharmacist" />
            <SidebarInset>
                 <div className="flex flex-col min-h-screen">
                    <AppHeader role="Pharmacist" />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
                        Powered by DevFlux 2025
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
  );
}
