//// Aceturnity UI Tabs

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

interface TabsMenuProps {
  tabs: Tab[];
  value?: string;
  onChange?: (value: string) => void;
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}

export const TabsMenu = ({
  tabs: propTabs,
  value,
  onChange,
  containerClassName,
  activeTabClassName,
  tabClassName,
}: TabsMenuProps) => {
  const [active, setActive] = useState<Tab>(
    propTabs.find((tab) => tab.value === value) ?? propTabs[0]!,
  );

  const handleTabClick = (tab: Tab) => {
    setActive(tab);
    onChange?.(tab.value);
  };

  return (
    <div
      className={cn(
        "no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto",
        containerClassName,
      )}
    >
      {propTabs.map((tab) => (
        <button
          key={tab.title}
          onClick={() => handleTabClick(tab)}
          className={cn("relative rounded-full px-4 py-2", tabClassName)}
        >
          {tab.value === value && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute inset-0 rounded-full bg-white/10",
                activeTabClassName,
              )}
            />
          )}
          <span className="relative block text-sm font-medium">
            {tab.title}
          </span>
        </button>
      ))}
    </div>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tabs[0]?.value === tab.value;
  };
  return (
    <div className="relative h-full w-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("absolute left-0 top-0 h-full w-full", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
