"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  name: string;
  href?: string;
  icon?: string;
  submenu?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    name: "WebContent",
    submenu: [
      { name: "Static", href: "/admin/webcontent/static" },
      { name: "Dynamic", href: "/admin/webcontent/dynamic" },
    ],
  },
  // Add more menu items here
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("WebContent");

  return (
    <div className="fixed left-0 top-0 z-40 h-full w-64 border-r border-gray-200 bg-white pt-20">
      <nav className="space-y-1 px-4">
        {menuItems.map((item) => (
          <div key={item.name}>
            <button
              onClick={() =>
                setOpenSubmenu(openSubmenu === item.name ? null : item.name)
              }
              className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <span>{item.name}</span>
              <span className="transition-transform duration-200">
                {openSubmenu === item.name ? "▼" : "▶"}
              </span>
            </button>
            {item.submenu && openSubmenu === item.name && (
              <div className="ml-4 space-y-1">
                {item.submenu.map((subitem) => (
                  <Link
                    key={subitem.href}
                    href={subitem.href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      pathname === subitem.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {subitem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
