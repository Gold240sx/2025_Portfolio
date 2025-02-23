"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { SignInButton } from "./auth/SignInButton";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 transition-colors ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { state } = useSidebar();

  return (
    <nav className="w-screen border-b border-white/10 bg-black/80">
      <div
        className={cn(
          "flex h-16 w-full items-center justify-between px-4 transition-all duration-200",
          state === "expanded" ? "pl-72" : "pl-20",
        )}
      >
        <Link
          href="/"
          className={cn(
            "text-xl font-bold text-white transition-opacity duration-200",
            state === "expanded" ? "opacity-0" : "opacity-100",
          )}
        >
          Your Name
        </Link>
        <div className="flex items-center gap-8">
          <div className="flex gap-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
          <SignInButton />
        </div>
      </div>
    </nav>
  );
}
