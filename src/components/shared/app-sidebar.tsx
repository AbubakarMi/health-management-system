
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { LogOut, ChevronRight } from "lucide-react";
import { navLinks, type Role, NavLink, NavLinkGroup } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

interface AppSidebarProps {
  role: Role;
}

function isNavLink(item: NavLink | NavLinkGroup): item is NavLink {
    return 'href' in item;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();
  const links = navLinks[role];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-white text-lg font-headline shadow-lg">
                N
            </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent font-headline">Nubenta Care</h2>
            <Badge variant="secondary" className="w-fit text-xs">{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((item, index) => {
            if (isNavLink(item)) {
              const isDashboardLink = item.href === `/${role}`;
              const isActive = isDashboardLink ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            } else {
              const isGroupActive = item.links.some(link => pathname.startsWith(link.href));
              return (
                 <Collapsible key={index} className="w-full" defaultOpen={isGroupActive}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full">
                              <span>{item.label}</span>
                              <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                        <div className="pl-6">
                            {item.links.map(link => {
                              const isActive = pathname.startsWith(link.href);
                              return (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={link.label}
                                    >
                                        <Link href={link.href}>
                                        <link.icon className="w-5 h-5" />
                                        <span>{link.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                              )
                            })}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
              )
            }
          })}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
