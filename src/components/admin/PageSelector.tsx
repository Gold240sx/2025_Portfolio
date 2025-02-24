"use client";

import { TabsMenu } from "@/components/ui/TabsMenu";
import { pageConfigs } from "~/types/content";

interface PageSelectorProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

export function PageSelector({ currentPage, onPageChange }: PageSelectorProps) {
  const tabs = Object.entries(pageConfigs).map(([key, config]) => ({
    title: config.title,
    value: key,
    content:
      (config as any).description ||
      `Manage ${config.title.toLowerCase()} content`,
  }));

  return (
    <div className="flex flex-col gap-2">
      <TabsMenu
        tabs={tabs}
        value={currentPage}
        onChange={onPageChange}
        containerClassName="w-full"
        activeTabClassName="bg-black/10 dark:bg-white/10 shadow-sm"
        tabClassName="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
      />
      <span className="text-sm text-muted-foreground">
        {tabs.find((tab) => tab.value === currentPage)?.content}
      </span>
    </div>
  );
}
