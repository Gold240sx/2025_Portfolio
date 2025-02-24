"use client";

import { TipTapEditor } from "~/components/editor/TipTapEditor";
import { api } from "~/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TipTapToggleGroup } from "~/components/editor/TipTapToggleGroup";

export default function PageContentPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const { data: content, isLoading } = api.siteContent.getAboutMe.useQuery();
  const utils = api.useUtils();
  const { toast } = useToast();
  const { mutate: updateContent, isPending } =
    api.siteContent.updateAboutMe.useMutation({
      onSuccess: () => {
        toast({
          title: "Content saved successfully!",
        });
        utils.siteContent.getAboutMe.invalidate();
      },
      onError: (error) => {
        toast({
          title: "Error saving content",
          description: error.message,
        });
      },
    });

  useEffect(() => {
    if (content !== undefined) {
      setLocalContent(content);
    }
  }, [content]);

  const handleCancel = () => {
    setLocalContent(content ?? "");
    setMode("edit");
  };

  const handleSave = () => {
    updateContent({ content: localContent });
    setIsEditing(false);
    setMode("edit");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container relative mx-auto p-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit About Me</h2>
          {isEditing && <TipTapToggleGroup mode={mode} setMode={setMode} />}
        </div>
        <TipTapEditor
          content={localContent}
          onChange={setLocalContent}
          isEditing={isEditing}
          onEditToggle={setIsEditing}
          onCancel={handleCancel}
          mode={mode}
        />
        {isEditing && (
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                handleCancel();
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
