"use client";

import { useState } from "react";
import { CodeExcerpt } from "~/components/myComponents/CodeExcerpt";
import { Button } from "~/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface DatabaseInfoPanelProps {
  content: {
    title: string;
    content: string;
    updatedAt: Date | null;
    updatedBy: string | null;
  };
  tableName: string;
  onMinimize: () => void;
}

export function DatabaseInfoPanel({
  content,
  tableName,
  onMinimize,
}: DatabaseInfoPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const dbObject = {
    table: tableName,
    key: "aboutMe",
    structure: {
      title: "varchar(255)",
      content: "text",
      updated_at: "timestamp",
      updated_by: "varchar(255)",
    },
    currentValues: {
      title: content.title,
      content: content.content,
      updated_at: content.updatedAt,
      updated_by: content.updatedBy,
    },
  };

  const codeString = `/*
  * Database Table: ${tableName}
  * Description: Stores website content with versioning information
  * Primary Key: key (varchar)
  */\n
${JSON.stringify(dbObject, null, 2)}`;

  return (
    <div className="w-96 bg-zinc-900 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <Button
          className="bg-white/20 hover:bg-white/30"
          size="sm"
          onClick={onMinimize}
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
        <h3 className="text-sm font-medium text-white">Data Structure</h3>
      </div>
      <CodeExcerpt
        content={codeString}
        language="javascript"
        theme="dark"
        className="mt-2"
        title="Code Excerpt"
        titleClassName="text-white"
      />
    </div>
  );
}
