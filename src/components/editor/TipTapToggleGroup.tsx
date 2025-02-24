"use client";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Pencil, Eye } from "lucide-react";

interface TipTapToggleGroupProps {
  mode: string;
  setMode: (mode: "edit" | "preview") => void;
}

export function TipTapToggleGroup({ mode, setMode }: TipTapToggleGroupProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && setMode(value as "edit" | "preview")}
      className="justify-start"
    >
      <ToggleGroupItem value="edit" aria-label="Edit mode">
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </ToggleGroupItem>
      <ToggleGroupItem value="preview" aria-label="Preview mode">
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
