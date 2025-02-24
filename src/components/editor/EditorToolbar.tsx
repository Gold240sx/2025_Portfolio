"use client";

import { Editor } from "@tiptap/react";
import { Button } from "~/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  Type,
  Text,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  ArrowUp,
  ArrowDown,
  AArrowUp,
  AArrowDown,
} from "lucide-react";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface EditorToolbarProps {
  editor: Editor | null;
}

const COLORS = [
  // Gray scale
  { hex: "#000000", name: "Black" },
  { hex: "#18181B", name: "Zinc 900" },
  { hex: "#3F3F46", name: "Zinc 700" },
  { hex: "#71717A", name: "Zinc 500" },
  { hex: "#D4D4D8", name: "Zinc 300" },
  { hex: "#FFFFFF", name: "White" },

  // Colors
  { hex: "#EF4444", name: "Red 500" },
  { hex: "#F97316", name: "Orange 500" },
  { hex: "#F59E0B", name: "Amber 500" },
  { hex: "#EAB308", name: "Yellow 500" },
  { hex: "#84CC16", name: "Lime 500" },
  { hex: "#22C55E", name: "Green 500" },
  { hex: "#10B981", name: "Emerald 500" },
  { hex: "#14B8A6", name: "Teal 500" },
  { hex: "#06B6D4", name: "Cyan 500" },
  { hex: "#0EA5E9", name: "Sky 500" },
  { hex: "#3B82F6", name: "Blue 500" },
  { hex: "#6366F1", name: "Indigo 500" },
  { hex: "#8B5CF6", name: "Violet 500" },
  { hex: "#A855F7", name: "Purple 500" },
  { hex: "#D946EF", name: "Fuchsia 500" },
  { hex: "#EC4899", name: "Pink 500" },
  { hex: "#F43F5E", name: "Rose 500" },
  { hex: "#881337", name: "Rose 900" },
];

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-1 p-1 sm:gap-2 sm:p-2">
          {/* Basic Formatting */}
          <div className="flex gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-full w-full" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-full w-full" />
            </Button>
          </div>

          <div className="mx-0.5 h-4 w-px bg-gray-200 sm:mx-2" />

          {/* Headings */}
          <div className="flex gap-0.5 sm:gap-1">
            {[Heading1, Heading2, Heading3].map((Icon, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: (index + 1) as 1 | 2 | 3 })
                    .run()
                }
              >
                <Icon className="h-full w-full" />
              </Button>
            ))}
          </div>

          <div className="mx-0.5 h-4 w-px bg-gray-200 sm:mx-2" />

          {/* Alignment */}
          <div className="flex gap-0.5 sm:gap-1">
            {[
              { icon: AlignLeft, align: "left" },
              { icon: AlignCenter, align: "center" },
              { icon: AlignRight, align: "right" },
            ].map(({ icon: Icon, align }) => (
              <Button
                key={align}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setTextAlign(align as any)
                    .run()
                }
              >
                <Icon className="h-full w-full" />
              </Button>
            ))}
          </div>

          <div className="mx-0.5 h-4 w-px bg-gray-200 sm:mx-2" />

          {/* Lists and Quote */}
          <div className="flex gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-full w-full" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-full w-full" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-full w-full" />
            </Button>
          </div>

          <div className="mx-0.5 h-4 w-px bg-gray-200 sm:mx-2" />

          {/* Color and Font Size */}
          <div className="flex gap-0.5 sm:gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
                >
                  <Palette className="h-full w-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="grid grid-cols-4 gap-1 p-1">
                {COLORS.map((color) => (
                  <DropdownMenuItem
                    key={color.hex}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setMark("textStyle", { color: color.hex })
                        .run()
                    }
                    className="flex h-8 w-8 items-center justify-center p-0"
                    title={color.name}
                  >
                    <div
                      className="h-6 w-6 rounded-md border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => {
                const currentSize =
                  editor.getAttributes("textStyle").fontSize || "16px";
                const size = parseInt(currentSize) - 2;
                editor
                  .chain()
                  .focus()
                  .setMark("textStyle", { fontSize: `${size}px` })
                  .run();
              }}
            >
              <AArrowDown className="h-full w-full" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1.5 sm:h-9 sm:w-9 sm:p-2"
              onClick={() => {
                const currentSize =
                  editor.getAttributes("textStyle").fontSize || "16px";
                const size = parseInt(currentSize) + 2;
                editor
                  .chain()
                  .focus()
                  .setMark("textStyle", { fontSize: `${size}px` })
                  .run();
              }}
            >
              <AArrowUp className="h-full w-full" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
