"use client";

import { Pencil, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TipTapToggleGroupProps {
  mode: "edit" | "preview";
  setMode: (mode: "edit" | "preview") => void;
  className?: string;
}

export function TipTapToggleGroup({
  mode,
  setMode,
  className,
}: TipTapToggleGroupProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && setMode(value as "edit" | "preview")}
      className="rounded-lg border bg-white dark:bg-zinc-900"
    >
      <ToggleGroupItem
        value="edit"
        className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary dark:data-[state=on]:bg-primary/20"
      >
        <Pencil className="h-4 w-4" />
        <span>Edit</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="preview"
        className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary dark:data-[state=on]:bg-primary/20"
      >
        <Eye className="h-4 w-4" />
        <span>Preview</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
