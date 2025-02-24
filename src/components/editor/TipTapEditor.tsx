"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Pencil, Eye, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { truncate } from "~/utils/text";
import { EditorToolbar } from "./EditorToolbar";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onCancel?: () => void;
  mode?: string;
}

interface FontSizeOptions {
  types: string[];
}

// Create a custom extension for font size
const FontSize = Extension.create({
  name: "fontSize",

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

export function TipTapEditor({
  content = "",
  onChange,
  isEditing = false,
  onEditToggle,
  mode = "edit",
}: TipTapEditorProps) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: { class: "mb-4" },
          },
          blockquote: {
            HTMLAttributes: {
              class: "border-l-4 border-gray-300 pl-4 my-4",
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc list-inside",
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal list-inside",
            },
          },
        }),
        Heading.configure({
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "font-bold",
          },
        }),
        TextStyle,
        FontSize,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
        }),
      ],
      content,
      editable: true,
      editorProps: {
        attributes: {
          class:
            "prose prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl max-w-none focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
    },
    [isEditing],
  );

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [editor, isEditing]);

  if (!isEditing) {
    return (
      <div className="group relative">
        <div className="prose max-w-none">
          <div
            className="line-clamp-3 text-zinc-600"
            dangerouslySetInnerHTML={{
              __html: truncate(content, 250) + "...",
            }}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-8 right-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onEditToggle?.(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mode === "edit" ? (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
          <EditorToolbar editor={editor} />
          <div className="p-4">
            <EditorContent editor={editor} className="min-h-[200px]" />
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }} />
        </div>
      )}
    </div>
  );
}
