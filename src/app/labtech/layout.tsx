
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function LabTechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <AppSidebar role="labtech" />
            <SidebarInset>
                 <div className="flex flex-col min-h-screen">
                    <AppHeader role="Lab Tech" />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
                        Powered by DevFlux 2025
                    </footer>
                </div>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
