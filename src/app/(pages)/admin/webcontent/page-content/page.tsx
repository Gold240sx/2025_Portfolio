"use client";

import { useState } from "react";
import { PageSelector } from "~/components/admin/PageSelector";
import { ContentEditor } from "~/components/admin/ContentEditor";
import { type ContentSection, pageConfigs } from "~/types/content";
import { useToast } from "@/hooks/use-toast";
import { api } from "~/trpc/react";
import { DatabaseInfoPanel } from "~/components/admin/DatabaseInfoPanel";
import { type PageConfig } from "~/types/content";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { LogoUploader } from "~/components/admin/LogoUploader";

type PageKey = "home" | "about" | "projects" | "contact" | "blog";

export default function PageContentPage() {
  const [currentPage, setCurrentPage] = useState<PageKey>("about");
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isInfoPanelMinimized, setIsInfoPanelMinimized] = useState(false);

  const config = pageConfigs[currentPage];
  if (!config) return null;

  const { data: content, isLoading } =
    api.siteContent[config.getQuery as keyof typeof api.siteContent].useQuery();
  const utils = api.useUtils();
  const { toast } = useToast();

  const { mutate: updateContent } = api.siteContent[
    config.updateQuery as keyof typeof api.siteContent
  ].useMutation({
    onSuccess: () => {
      toast({ title: "Content saved successfully!" });
      utils.siteContent[
        config.getQuery as keyof typeof api.siteContent
      ].invalidate();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const handleSave = (section: ContentSection) => {
    updateContent({
      title: section.title,
      content: section.content,
    });
  };

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId as PageKey);
    setIsEditing(false);
    setMode("edit");
  };

  const renderEditor = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="flex min-h-[500px] flex-col space-y-6 rounded-lg bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">
              Website Settings
            </h2>
            <LogoUploader
              currentLogo={content?.logoUrl}
              onLogoUpdate={(url) => {
                updateContent({
                  logoUrl: url,
                });
              }}
              isUpdating={isLoading}
            />
          </div>
        );
      case "about":
        return (
          <ContentEditor
            section={{
              title: content?.title ?? config.title,
              content: content?.content ?? "",
              updatedAt: content?.updatedAt ?? undefined,
              updatedBy: content?.updatedBy ?? undefined,
            }}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            mode={mode}
            setMode={setMode}
            onSave={handleSave}
            isPending={isLoading}
          />
        );
      case "projects":
        return (
          <div className="flex min-h-[500px] flex-col space-y-6 rounded-lg bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">
              Projects Page Content
            </h2>
            <p className="text-muted-foreground">
              Configure your projects page content here.
            </p>
          </div>
        );
      case "contact":
        return (
          <div className="flex min-h-[500px] flex-col space-y-6 rounded-lg bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">
              Contact Page Content
            </h2>
            <p className="text-muted-foreground">
              Configure your contact page content here.
            </p>
          </div>
        );
      case "blog":
        return (
          <div className="flex min-h-[500px] flex-col space-y-6 rounded-lg bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">
              Blog Page Content
            </h2>
            <p className="text-muted-foreground">
              Configure your blog page content here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container relative mx-auto space-y-6 p-6">
      <PageSelector currentPage={currentPage} onPageChange={handlePageChange} />
      <div className="grid grid-cols-[1fr,auto] gap-6">
        {renderEditor()}
        {isInfoPanelMinimized ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsInfoPanelMinimized(false)}
            className="h-8 w-8"
          >
            <Code className="h-4 w-4" />
            <span className="sr-only">Show database info</span>
          </Button>
        ) : (
          currentPage === "about" && (
            <DatabaseInfoPanel
              content={{
                title: content?.title ?? "",
                content: content?.content ?? "",
                updatedAt: content?.updatedAt ?? null,
                updatedBy: content?.updatedBy ?? null,
              }}
              tableName={config.table}
              onMinimize={() => setIsInfoPanelMinimized(true)}
            />
          )
        )}
      </div>
    </div>
  );
}
