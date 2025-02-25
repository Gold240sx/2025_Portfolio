"use client";

import React, { useState } from "react";
import { ChunkDefinition } from "@/types/chunks";
import { useDocumentUploadThingUpload } from "@/hooks/useDocumentUploadThingUpload";
import { OurFileRouter } from "@/app/api/uploadthing/config";

interface UploadFormProps {
  selectedFile: File | null;
  progress: number;
  uploadStatus: string;
  handleFileSelect: (file: File | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  chunks: ChunkDefinition[];
  onChunkSelect?: (chunk: "semantic" | "recursive") => void;
  onUseDefault?: () => void;
  isExtracting?: boolean;
  isUploading?: boolean;
  filePreviewUrl?: string;
  onReset?: () => void;
  isDefaultFile?: boolean;
  extractedData?: any;
  isProcessing?: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  progress,
  chunks,
  onChunkSelect,
  onUseDefault,
  isExtracting = false,
  isUploading = false,
  filePreviewUrl,
  onReset,
  isDefaultFile = false,
  extractedData,
  isProcessing = false,
}) => {
  // Extract mode hooks
  const {
    uploadProgress,
    uploadStatus,
    selectedFile,
    isUsingDefault,
    handleFileSelect,
    handleSubmit,
    useDefaultFile,
    resetForm,
    uploadedUrl,
  } = useDocumentUploadThingUpload();

  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const isComplete = extractedData !== undefined;
  const shouldDisableControls = isProcessing || isComplete;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await handleSubmit(e);
  };

  const onFileSelect = (file: File | null) => {
    handleFileSelect(file);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <input
              type="file"
              onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
              accept="application/pdf,image/*"
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className={`block flex-1 px-6 py-3 text-center ${
                isProcessing
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-blue-500 hover:bg-blue-600"
              } rounded-lg text-white transition-colors duration-200`}
            >
              {selectedFile ? selectedFile.name : "Select File"}
            </label>
            <button
              type="button"
              onClick={onUseDefault}
              disabled={isProcessing}
              className={`px-6 py-3 ${
                isProcessing
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-gray-500 hover:bg-gray-600"
              } rounded-lg text-white transition-colors duration-200`}
            >
              Use Default
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            PDF and image files up to 8MB
          </p>
        </div>

        {/* File Preview - Mobile Toggle */}
        {filePreviewUrl && (
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="flex w-full items-center justify-between rounded-lg border bg-gray-50 px-4 py-2 transition-colors duration-200 hover:bg-gray-100"
            >
              <span className="text-sm font-medium text-gray-700">
                File Preview
              </span>
              <svg
                className={`h-5 w-5 transform text-gray-500 transition-transform duration-200 ${
                  isPreviewExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isPreviewExpanded && (
              <div className="mt-2 overflow-hidden rounded-lg border">
                <div className="h-[600px]">
                  <iframe
                    src={filePreviewUrl}
                    className="h-full w-full"
                    title="PDF Preview"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {selectedFile && (
          <>
            {/* Upload Status Indicator */}
            <div className="flex items-center justify-center space-x-2">
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <p className="text-sm text-gray-600">Uploading document...</p>
                </>
              ) : uploadStatus ? (
                <p className="text-sm text-green-600">
                  Document uploaded successfully
                </p>
              ) : null}
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Extraction Method
              </label>
              <select
                className={`w-full rounded-md border border-gray-300 p-2 ${
                  isProcessing ? "cursor-not-allowed bg-gray-100" : ""
                }`}
                onChange={(e) =>
                  onChunkSelect?.(e.target.value as "semantic" | "recursive")
                }
                defaultValue={chunks[0]?.value}
                disabled={isProcessing}
              >
                {chunks.map((chunk) => (
                  <option
                    key={chunk.id}
                    value={chunk.value}
                    title={chunk.description}
                  >
                    {chunk.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className={`flex-1 px-6 py-3 ${
                  isProcessing
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-500 hover:bg-green-600"
                } rounded-lg text-white transition-colors duration-200`}
                disabled={isProcessing}
              >
                {isExtracting
                  ? "Extracting..."
                  : isUploading
                    ? "Uploading..."
                    : progress > 0 && progress < 100
                      ? "Processing..."
                      : isDefaultFile
                        ? "Start Extraction"
                        : "Upload and Extract"}
              </button>
              {isComplete && onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded-lg bg-red-500 px-6 py-3 text-white transition-colors duration-200 hover:bg-red-600"
                >
                  Reset Form
                </button>
              )}
            </div>
          </>
        )}
      </form>

      {/* Status Messages */}
      {uploadStatus && !isExtracting && !isUploading && (
        <p className="text-center text-sm text-gray-600">{uploadStatus}</p>
      )}
    </div>
  );
};
