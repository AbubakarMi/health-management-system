

"use client";

import { useState, useEffect, useContext } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { notificationManager, Notification } from "@/lib/constants";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { CallContext } from "@/app/admin/layout";

interface AppHeaderProps {
  role: string;
}

export function AppHeader({ role }: AppHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const callContext = useContext(CallContext);


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
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Welcome, {role}!
            </h1>
            <p className="text-xs text-muted-foreground h-4">
                {currentDateTime ? format(currentDateTime, 'eeee, MMMM dd, yyyy | hh:mm:ss a') : ''}
            </p>
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
         {role === 'Admin' && (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                        <Bell className="h-[1.2rem] w-[1.2rem]" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
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
        )}
        <ThemeToggle />
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" alt="@user" />
          <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
