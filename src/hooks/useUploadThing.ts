import { useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";

const { useUploadThing: useUploadThingCore } =
  generateReactHelpers<OurFileRouter>();

export function useUploadThing() {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { startUpload } = useUploadThingCore("imageUploader");

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setUploadedUrl("");
    setUploadStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadStatus("Uploading...");

    try {
      const res = await startUpload([selectedFile]);
      if (res?.[0]?.url) {
        setUploadedUrl(res[0].url);
        setUploadStatus("Upload complete");
        return res[0].url;
      }
    } catch (error: any) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return {
    uploadedUrl,
    uploadStatus,
    selectedFile,
    handleFileSelect,
    handleSubmit,
  };
}
