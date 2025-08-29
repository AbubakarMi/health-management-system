

"use client";

import { useState, useEffect, useContext } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { notificationManager, Notification } from "@/lib/constants";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";


interface AppHeaderProps {
  role: string;
}

export function AppHeader({ role }: AppHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);


  useEffect(() => {
    setCurrentDateTime(new Date());
    const timer = setInterval(() => {
        setCurrentDateTime(new Date());
    }, 1000);

    const handleUpdate = (updatedNotifications: Notification[]) => {
        setNotifications([...updatedNotifications]);
        setUnreadCount(notificationManager.getUnreadCount());
    };
    handleUpdate(notificationManager.getNotifications());
    const unsubscribe = notificationManager.subscribe(handleUpdate);

    return () => {
        clearInterval(timer);
        unsubscribe();
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    notificationManager.markAsRead(notification.id);
  }

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 animate-fade-in">
      <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold md:text-2xl font-headline nubenta-gradient-text animate-glow">
                  Welcome, {role}!
              </h1>
              <div className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white rounded-full animate-pulse-slow">
                Powered by Nubenta
              </div>
            </div>
            <p className="text-xs text-muted-foreground h-4 font-medium">
                {currentDateTime ? format(currentDateTime, 'eeee, MMMM dd, yyyy | hh:mm:ss a') : ''}
            </p>
          </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
         <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative hover:bg-primary/10 transition-all duration-200 hover:scale-105">
                    <Bell className="h-[1.2rem] w-[1.2rem] transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white font-semibold animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-3 font-semibold text-sm border-b">Notifications</div>
                <ScrollArea className="h-96">
                    {notifications.length > 0 ? (
                         notifications.map(notification => (
                            <Link
                                key={notification.id}
                                href={notification.href}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "block p-3 hover:bg-muted",
                                    !notification.read && "bg-primary/10"
                                )}
                            >
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(parseISO(notification.timestamp), { addSuffix: true })}
                                </p>
                            </Link>
                         ))
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            You have no new notifications.
                        </div>
                    )}
                </ScrollArea>
                 {notifications.length > 0 && (
                    <div className="p-2 border-t">
                        <Button variant="link" size="sm" className="w-full" onClick={() => notificationManager.markAllAsRead()}>
                            Mark all as read
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
        <ThemeToggle />
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" alt="@user" />
          <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
