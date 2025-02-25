"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./theme/theme-toggle";
import { SignInButton } from "./auth/SignInButton";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { env } from "~/env";
import { useSidebar } from "@/components/ui/sidebar";

export function Navbar() {
  const { data: siteContent } = api.siteContent.getHomeContent.useQuery();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { state } = useSidebar();
  const isSidebarOpen = state === "expanded";

  const isDeveloperOrAdmin = session?.user?.email === env.NEXT_PUBLIC_DEV_EMAIL;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 justify-between !pl-6">
        <div className="mr-4 flex min-w-[96px] items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            {siteContent?.logoUrl ? (
              <Image
                src={siteContent.logoUrl}
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-fit"
              />
            ) : (
              <span className="text-xl font-bold">Your Site</span>
            )}
          </Link>
        </div>
        <div className="mr-4 flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image ?? undefined}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`fixed mt-2 min-w-56 dark:bg-zinc-900 ${
                    isSidebarOpen ? "right-[210px]" : "right-0"
                  }`}
                  align="end"
                  // forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user?.image ?? undefined}
                          alt="@shadcn"
                        />
                        <AvatarFallback>
                          {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Only display the admin dashboard if the user is the admin / Developer */}
                  {isDeveloperOrAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="my-1 mt-2 text-[1.12rem] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className={`${isDeveloperOrAdmin ? "my-1 mb-2" : "my-2"} text-[1.12rem] hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="m-1 mt-2 items-center justify-center bg-blue-500 text-center text-white hover:bg-blue-600 focus:hover:bg-blue-600"
                    onSelect={() => {
                      setOpen(false);
                      signOut();
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInButton />
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
