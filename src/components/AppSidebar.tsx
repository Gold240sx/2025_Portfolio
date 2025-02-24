"use client";

import {
  Activity,
  BookType,
  Calendar,
  ChevronUp,
  CircleDollarSign,
  Code,
  DatabaseIcon,
  FileImage,
  FileText,
  FileType,
  FolderPen,
  Home,
  ImageUp,
  Infinity,
  Info,
  LinkIcon,
  LogOut,
  Menu,
  MessageCircle,
  Newspaper,
  PanelLeftDashed,
  Pickaxe,
  ScanEye,
  Search,
  Shovel,
  Snail,
  SquareFunction,
  Table,
  Tally5,
  Text,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { SafeLog } from "@/utils/safeLog";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type Section = {
  id: string;
  title: string;
  disabled?: boolean;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  items: MenuItem[];
};

type SectionGroup = {
  id: string;
  title: string;
  link?: string;
  sections: Section[];
};

const sectionGroups: SectionGroup[] = [
  {
    id: "home",
    title: "Home",
    link: "/dashboard",
    sections: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: Home,
        iconBgColor: "bg-indigo-100 dark:bg-indigo-950",
        iconColor: "text-indigo-600 dark:text-indigo-200",
        items: [
          {
            title: "Welcome",
            url: "/admin/welcome",
            icon: Info,
          },
          {
            title: "Dashboard",
            url: "/admin",
            icon: Info,
          },
        ],
      },
      {
        id: "Users",
        title: "Users",
        icon: Users,
        iconBgColor: "bg-red-100 dark:bg-red-950",
        iconColor: "text-red-600 dark:text-red-200",
        items: [
          {
            title: "Users",
            url: "/admin/users",
            icon: Users,
          },
        ],
      },
      {
        id: "messages",
        title: "Messages",
        icon: MessageCircle,
        iconBgColor: "bg-purple-300 dark:bg-purple-950",
        iconColor: "text-purple-600 dark:text-purple-200",
        items: [
          {
            title: "Messages",
            url: "/admin/messages",
            icon: MessageCircle,
          },
        ],
      },
      {
        id: "stats",
        title: "Stats",
        icon: Tally5,
        iconBgColor: "bg-green-100 dark:bg-green-950",
        iconColor: "text-green-600 dark:text-green-200",
        items: [
          {
            title: "Users",
            url: "/admin/stats/users",
            icon: Users,
          },
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    sections: [
      {
        id: "webcontent",
        title: "Web Content",
        icon: FileText,
        iconBgColor: "bg-blue-100 dark:bg-blue-950",
        iconColor: "text-blue-600 dark:text-blue-200",
        items: [
          {
            title: "Page Content",
            url: "/admin/webcontent/page-content",
            icon: BookType,
          },
          {
            title: "Data Content",
            url: "/admin/webcontent/data-content",
            icon: DatabaseIcon,
          },
          {
            title: "Links",
            url: "/admin/webcontent/links",
            icon: LinkIcon,
          },
          {
            title: "Media",
            url: "/admin/webcontent/media",
            icon: ImageUp,
          },
        ],
      },
    ],
  },
];

const getInitialExpandedSections = (groups: SectionGroup[]) => {
  return Object.fromEntries(
    groups.flatMap((group) =>
      group.sections.map((section) => [section.id, false]),
    ),
  );
};

export function AppSidebar() {
  const router = useRouter();
  const { setOpen, state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(getInitialExpandedSections(sectionGroups));
  const pathname = usePathname();
  const { data: session } = useSession();

  const isCurrentPath = (url: string) => pathname === url;

  const sectionContainsCurrentPath = (section: Section) => {
    return section.items.some((item) => isCurrentPath(item.url));
  };

  const groupContainsCurrentPath = (group: SectionGroup) => {
    return group.sections.some(sectionContainsCurrentPath);
  };

  const toggleSection = (sectionId: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(".icon-container") &&
      target.closest('[data-state="collapsed"]')
    ) {
      setOpen(true);
    } else {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }));
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      router.push("/sign-in");
    } catch (error) {
      SafeLog({ display: false, log: { "Sign out error": error } });
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpenMobile(true);
        }}
        className="absolute left-4 top-2 z-50 my-2 h-fit w-fit rounded-md bg-white/20 p-2 shadow-black/30 hover:bg-accent md:hidden lg:hidden"
      >
        <PanelLeftDashed className="h-5 w-5 text-white" />
      </button>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent className="relative flex h-full flex-col bg-white dark:bg-zinc-900">
          <div className="relative">
            <div className="absolute right-2 top-2 z-10 data-[state=collapsed]:left-[0.6rem] data-[state=collapsed]:right-auto lg:block">
              <SidebarTrigger className="data-[state=closed]:absolute data-[state=closed]:-right-10 data-[state=closed]:top-0" />
            </div>
          </div>
          <div
            className={cn(
              "flex h-screen flex-col border-r",
              "bg-sidebar-background shadow-lg",
              "border-sidebar-border",
            )}
          >
            <div className="mt-6 flex-1 overflow-y-auto pb-[120px] pt-2">
              <SidebarGroup>
                <SidebarGroupLabel className="sr-only mb-6 px-2 py-4 text-xl font-bold data-[state=collapsed]:hidden">
                  APIs
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <div className="space-y-8">
                      {sectionGroups.map((group) => (
                        <div key={group.id} className="space-y-6">
                          <SidebarGroupLabel
                            className={cn(
                              "px-2 py-4 text-xl font-bold data-[state=collapsed]:hidden",
                              !isCollapsed &&
                                groupContainsCurrentPath(group) &&
                                "text-blue-600",
                            )}
                          >
                            <Link
                              className={`${
                                group.link
                                  ? "hover:text-blue-600"
                                  : "cursor-default"
                              }`}
                              href={group.link ? group.link : "#"}
                            >
                              {group.title}
                            </Link>
                          </SidebarGroupLabel>
                          {group.sections.map((section) => (
                            <div key={section.id}>
                              <button
                                onClick={(e) => toggleSection(section.id, e)}
                                disabled={Boolean(section.disabled)}
                                className={cn(
                                  "group mb-2 flex w-full items-center gap-2",
                                  section.disabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "",
                                )}
                              >
                                <div
                                  className={cn(
                                    "icon-container flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md",
                                    section.iconBgColor,
                                  )}
                                >
                                  <section.icon
                                    className={cn("h-4 w-4", section.iconColor)}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    "flex-1 text-left text-lg font-medium text-sidebar-foreground/70 transition-all duration-200 ease-in hover:pl-1 data-[state=collapsed]:hidden",
                                    !expandedSections[section.id] &&
                                      sectionContainsCurrentPath(section) &&
                                      "text-blue-600",
                                  )}
                                >
                                  {section.title}
                                </span>
                                <ChevronUp
                                  className={cn(
                                    "h-4 w-4 text-sidebar-foreground/70 transition-transform data-[state=collapsed]:hidden",
                                    {
                                      "rotate-180":
                                        !expandedSections[section.id],
                                    },
                                  )}
                                />
                              </button>
                              <div
                                className={cn("space-y-1 transition-all", {
                                  hidden: !expandedSections[section.id],
                                  "pointer-events-none opacity-50": Boolean(
                                    section.disabled,
                                  ),
                                })}
                              >
                                {section.items.map((item) => {
                                  const isActive = pathname === item.url;

                                  return (
                                    <SidebarMenuItem key={item.title}>
                                      <SidebarMenuButton asChild>
                                        <Link
                                          href={item.url}
                                          className={cn(
                                            "peer/menu-button relative flex w-full items-center gap-2 overflow-hidden transition-colors duration-200",
                                            section.disabled &&
                                              "pointer-events-none",
                                            isActive && "text-blue-600",
                                            !isActive &&
                                              "hover:text-blue-500/70",
                                          )}
                                        >
                                          {isActive && !isCollapsed && (
                                            <div className="absolute left-[-12px] h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                                          )}
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <item.icon
                                                  className={cn(
                                                    "h-4 w-4 text-zinc-500",
                                                    isActive && "text-blue-600",
                                                  )}
                                                />
                                              </TooltipTrigger>
                                              <TooltipContent
                                                side="right"
                                                className="data-[state=expanded]:hidden"
                                              >
                                                {item.title}
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          <span
                                            className={cn(
                                              "text-base text-zinc-600 transition-colors duration-200 data-[state=collapsed]:hidden",
                                              isActive &&
                                                "font-medium text-blue-600",
                                              !isActive &&
                                                "hover:text-blue-500/70",
                                            )}
                                          >
                                            {item.title}
                                          </span>
                                          {isActive && !isCollapsed && (
                                            <div className="absolute right-0 h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                                          )}
                                        </Link>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 dark:bg-zinc-900">
              <Separator className="my-2" />
              <SidebarGroup>
                <div className="mb-2 flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image ?? ""} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black dark:text-white">
                      {session?.user?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => void signOut()}
                    className="mb-2 w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && (
                      <span className="flex-1 text-center">Sign out</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroup>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
