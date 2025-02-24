"use client";

import { TipTapEditor } from "~/components/editor/TipTapEditor";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronLeft } from "lucide-react";
import { TipTapToggleGroup } from "~/components/editor/TipTapToggleGroup";
import { type ContentSection } from "~/types/content";

interface ContentEditorProps {
  section: ContentSection;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  mode: "edit" | "preview";
  setMode: (value: "edit" | "preview") => void;
  onSave: (content: ContentSection) => void;
  isPending?: boolean;
}

export function ContentEditor({
  section,
  isEditing,
  setIsEditing,
  mode,
  setMode,
  onSave,
  isPending,
}: ContentEditorProps) {
  return (
    <div className="flex min-h-[500px] overflow-hidden rounded-lg bg-card shadow-sm">
      <div className="flex w-full flex-col space-y-6 px-6 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {section.title}
          </h1>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <TipTapToggleGroup mode={mode} setMode={setMode} />
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <TipTapEditor
          content={section.content}
          isEditing={isEditing}
          mode={mode}
          onModeChange={setMode}
          lastEdited={section.updatedAt}
          editedBy={section.updatedBy}
        />

        {isEditing && (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSave(section)} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
