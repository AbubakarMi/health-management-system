
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../theme-toggle";

interface AppHeaderProps {
  role: string;
}

export function AppHeader({ role }: AppHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentDateTime(new Date());
    }, 1000);

    return () => {
        clearInterval(timer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Welcome, {role}!
            </h1>
            <p className="text-xs text-muted-foreground">{format(currentDateTime, 'eeee, MMMM dd, yyyy | hh:mm:ss a')}</p>
          </div>
      </div>
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients, meds..."
              className="pl-8 w-full sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <ThemeToggle />
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" alt="@user" />
          <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
