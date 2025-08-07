
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
            <div className="w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center font-bold text-primary-foreground text-lg font-headline">
                C
            </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold font-headline">Careflux</h2>
            <Badge variant="secondary" className="w-fit">{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((item, index) => {
            if (isNavLink(item)) {
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href))}
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
                            {item.links.map(link => (
                            <SidebarMenuItem key={link.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === link.href || (link.href !== `/${role}` && pathname.startsWith(link.href))}
                                    tooltip={link.label}
                                >
                                    <Link href={link.href}>
                                    <link.icon className="w-5 h-5" />
                                    <span>{link.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            ))}
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
