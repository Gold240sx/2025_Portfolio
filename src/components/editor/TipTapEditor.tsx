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
import { cn } from "~/lib/utils";
import { Input } from "@/components/ui/input";
import { CodeExcerpt } from "~/components/myComponents/CodeExcerpt";
import { timeAgoConverter } from "~/utils/time";
import { Label } from "@/components/ui/label";

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onCancel?: () => void;
  mode?: "edit" | "preview";
  label?: string;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  viewClassName?: string;
  readOnly?: boolean;
  hideToolbar?: boolean;
  lastEdited?: Date;
  editedBy?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
  titleValue?: string;
  titleLabel?: string;
  contentLabel?: string;
  showDevInfo?: boolean;
  dbInfo?: {
    table: string;
    titleColumn?: string;
    contentColumn?: string;
    keyValue?: string;
  };
  onDevInfoToggle?: (show: boolean) => void;
  onModeChange?: (mode: "edit" | "preview") => void;
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
  label,
  placeholder = "Start writing...",
  minHeight = "200px",
  className = "",
  viewClassName = "",
  readOnly = false,
  hideToolbar = false,
  lastEdited,
  editedBy,
  title,
  onTitleChange,
  titleValue,
  titleLabel = "Title",
  contentLabel = "Content",
  showDevInfo = false,
  dbInfo,
  onDevInfoToggle,
  onModeChange,
}: TipTapEditorProps) {
  const DevInfo = ({
    info,
    field,
  }: {
    info: NonNullable<typeof dbInfo>;
    field: "title" | "content";
  }) => {
    if (!info) return null;

    const dbObject = {
      table: info.table,
      key: info.keyValue,
      column: field === "title" ? info.titleColumn : info.contentColumn,
    };

    return (
      <div className="mt-2 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
        <CodeExcerpt
          title=""
          content={JSON.stringify(dbObject, null, 2)}
          language="json"
          theme="light"
          className="my-0"
          hideCopy
        />
      </div>
    );
  };

  const editor = useEditor({
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
        class: cn(
          "prose prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl max-w-none focus:outline-none min-h-[200px]",
          className,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && editor.isEditable !== isEditing) {
      editor.setEditable(isEditing);
    }
  }, [editor, isEditing]);

  useEffect(() => {
    if (!isEditing && showDevInfo) {
      onDevInfoToggle?.(false);
    }
  }, [isEditing, showDevInfo, onDevInfoToggle]);

  const metadata = (
    <div className="mb-2 ml-2 mt-3 text-xs text-gray-500">
      {editedBy && <span>Edited by {editedBy}</span>}
      {lastEdited && (
        <span className="ml-2">{timeAgoConverter(lastEdited)}</span>
      )}
    </div>
  );

  const headerSection = (
    <div className="flex items-center justify-between">
      <div className="mb-4 w-full">
        <div className="flex items-center justify-between">
          <div className="w-full flex-grow">
            <div className="flex w-full flex-col">
              {isEditing ? (
                <>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-foreground"
                  >
                    {titleLabel}
                  </Label>
                  <Input
                    id="title"
                    value={titleValue ?? ""}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-background text-foreground"
                    placeholder="Enter title..."
                  />
                </>
              ) : (
                titleValue && (
                  <h2 className="text-lg font-semibold">{titleValue}</h2>
                )
              )}
            </div>
          </div>
        </div>
        {(lastEdited || editedBy) && metadata}
      </div>
    </div>
  );

  if (!isEditing) {
    return (
      <div className="space-y-2">
        {headerSection}
        <div className={cn("prose max-w-none", viewClassName)}>
          {showDevInfo && dbInfo && <DevInfo info={dbInfo} field="content" />}
          <div
            className="line-clamp-3 text-zinc-600"
            dangerouslySetInnerHTML={{
              __html: truncate(content, 250) + "...",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {headerSection}
      {mode === "edit" ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="flex-grow">
              <Label
                htmlFor="content"
                className="text-sm font-medium text-foreground"
              >
                {contentLabel}
              </Label>
              <div
                className={cn(
                  "prose dark:prose-invert max-w-none",
                  "prose-headings:text-foreground",
                  "prose-p:text-muted-foreground",
                  "prose-strong:text-foreground",
                  "prose-ul:text-muted-foreground",
                  "prose-ol:text-muted-foreground",
                  "prose-blockquote:text-muted-foreground",
                  "prose-code:text-muted-foreground",
                  "prose-hr:border-border",
                  isEditing ? "prose-sm" : "prose-lg",
                  "rounded-lg border bg-white shadow-sm dark:bg-zinc-900",
                )}
              >
                {!hideToolbar && <EditorToolbar editor={editor} />}
                <div className="relative rounded-b-lg border-t bg-background p-4 dark:bg-zinc-800/50">
                  <EditorContent
                    editor={editor}
                    className={cn("min-h-[200px]", className)}
                  />
                  {!editor?.getText() && (
                    <div className="pointer-events-none absolute left-4 top-4 text-gray-400 dark:text-gray-500">
                      {placeholder}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {showDevInfo && dbInfo && <DevInfo info={dbInfo} field="content" />}
          </div>
        </>
      ) : (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }} />
        </div>
      )}
    </div>
  );
}
