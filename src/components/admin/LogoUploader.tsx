"use client";

import { useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface LogoUploaderProps {
  currentLogo?: string | null;
  onLogoUpdate: (url: string) => void;
  isUpdating?: boolean;
}

export function LogoUploader({
  currentLogo,
  onLogoUpdate,
  isUpdating,
}: LogoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentLogo ?? null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      const res = await startUpload([selectedFile]);
      if (res?.[0]?.url) {
        onLogoUpdate(res[0].url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const clearSelection = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Website Logo</h3>
        <p className="text-sm text-muted-foreground">
          Upload your website logo (SVG or PNG)
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          {previewUrl ? (
            <div className="relative h-32 w-32">
              <Image
                src={previewUrl}
                alt="Logo preview"
                fill
                className="object-contain"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
              <input
                type="file"
                onChange={onFileSelect}
                accept=".svg,.png"
                className="hidden"
              />
              <Upload className="h-8 w-8 text-muted-foreground" />
            </label>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {selectedFile && (
          <Button onClick={onSubmit} disabled={isUploading || isUpdating}>
            {isUploading
              ? "Uploading..."
              : isUpdating
                ? "Updating..."
                : "Update Logo"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
