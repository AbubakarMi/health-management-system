
import * as React from "react";
import { cn } from "@/lib/utils";

export function NairaIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="M7 18V6" />
      <path d="M17 18V6" />
      <path d="M7 12h10" />
      <path d="m16 8-8 8" />
      <path d="m8 8 8 8" />
    </svg>
  );
}

    