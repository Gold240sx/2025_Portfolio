"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5 text-white" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white dark:bg-zinc-900">
        <SheetHeader>
          <SheetTitle className="text-left text-black dark:text-white">
            Navigation
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 pt-4">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-black/60 hover:text-primary dark:text-white/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === "/projects"
                ? "bg-primary/10 text-primary"
                : "text-black/60 hover:text-primary dark:text-white/60"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/about"
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === "/about"
                ? "bg-primary/10 text-primary"
                : "text-black/60 hover:text-primary dark:text-white/60"
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname === "/contact"
                ? "bg-primary/10 text-primary"
                : "text-black/60 hover:text-primary dark:text-white/60"
            }`}
          >
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
