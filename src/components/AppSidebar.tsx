"use client";

import {
  Activity,
  BookType,
  Calendar,
  ChevronUp,
  CircleDollarSign,
  Code,
  FileImage,
  FileText,
  FileType,
  FolderPen,
  Home,
  Infinity,
  Info,
  LogOut,
  Menu,
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
        iconBgColor: "bg-indigo-100",
        iconColor: "text-indigo-600",
        items: [
          {
            title: "Welcome",
            url: "/dashboard",
            icon: Info,
          },
        ],
      },
      {
        id: "stats",
        title: "Stats",
        icon: Tally5,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        items: [
          {
            title: "Users",
            url: "/stats/users",
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
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        items: [
          {
            title: "Page Content",
            url: "/admin/webcontent/page-content",
            icon: BookType,
          },
          {
            title: "Data Content",
            url: "/admin/webcontent/data-content",
            icon: Activity,
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
        className="hover:bg-accent z-50 my-2 ml-4 mt-4 h-fit w-fit rounded-md bg-white p-2 shadow-black/30 md:hidden lg:hidden"
      >
        <PanelLeftDashed className="h-5 w-5" />
      </button>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent className="relative flex h-full flex-col bg-white">
          <div className="relative">
            <div className="absolute right-2 top-2 z-10 data-[state=collapsed]:left-[0.6rem] data-[state=collapsed]:right-auto lg:block">
              <SidebarTrigger className="data-[state=closed]:absolute data-[state=closed]:-right-10 data-[state=closed]:top-0" />
            </div>
          </div>
          <div className="flex h-full flex-col">
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
                                    "text-sidebar-foreground/70 flex-1 text-left text-lg font-medium transition-all duration-200 ease-in hover:pl-1 data-[state=collapsed]:hidden",
                                    !expandedSections[section.id] &&
                                      sectionContainsCurrentPath(section) &&
                                      "text-blue-600",
                                  )}
                                >
                                  {section.title}
                                </span>
                                <ChevronUp
                                  className={cn(
                                    "text-sidebar-foreground/70 h-4 w-4 transition-transform data-[state=collapsed]:hidden",
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
            <div className="bg-background absolute bottom-0 left-0 right-0">
              <Separator className="my-2" />
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 py-1.5 data-[state=collapsed]:justify-center data-[state=collapsed]:px-2">
                              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                                <img
                                  src="https://media.licdn.com/dms/image/v2/C4E0BAQGqRyRh_kmy4Q/company-logo_200_200/company-logo_200_200/0/1630582118391/goparco_logo?e=2147483647&v=beta&t=4oX9T17qzp5O9eOhEeSSygw_HVNM6x_JQwAYn0VC5LE"
                                  alt="Parco Logo"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col overflow-hidden data-[state=collapsed]:hidden">
                                <span className="text-sidebar-foreground/70 text-xs">
                                  Signed in as
                                </span>
                                <span className="truncate text-sm font-bold text-gray-500">
                                  ADMIN
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="data-[state=expanded]:hidden"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs">Signed in as</span>
                              <span className="font-bold">ADMIN</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleSignOut}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <LogOut className="h-4 w-4 text-white" />
                        {!isCollapsed && (
                          <span className="flex-1 text-center text-white">
                            Sign out
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
