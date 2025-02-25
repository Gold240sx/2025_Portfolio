import { useState } from "react";
import { useUploadThing } from "./useUploadThing";

export function useDocumentUploadThingUpload() {
  const [isUsingDefault, setIsUsingDefault] = useState(false);
  const defaultFileUrl =
    "https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqG7ISpBGweVmXo0cniOfj8HrZ9JlWDkq2aU4Gt";

  const {
    uploadedUrl,
    uploadStatus,
    progress: uploadProgress,
    selectedFile,
    handleFileSelect,
    handleSubmit: handleUploadSubmit,
    handleUploadProgress,
    setSelectedFile,
    resetUpload,
  } = useUploadThing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !isUsingDefault) return;

    let fileUrl: string | null = isUsingDefault ? defaultFileUrl : null;

    if (!isUsingDefault) {
      const uploadedFileUrl = await handleUploadSubmit(e);
      if (uploadedFileUrl) {
        fileUrl = uploadedFileUrl;
      }
    }
  };

  const useDefaultFile = () => {
    setIsUsingDefault(true);
    const mockFile = new File([""], "sample.pdf", {
      type: "application/pdf",
    });
    setSelectedFile(mockFile);
  };

  const resetForm = () => {
    setIsUsingDefault(false);
    resetUpload();
  };

  return {
    uploadedUrl: isUsingDefault ? defaultFileUrl : uploadedUrl,
    uploadStatus,
    uploadProgress,
    selectedFile,
    isUsingDefault,
    handleFileSelect,
    handleSubmit,
    handleUploadProgress,
    useDefaultFile,
    resetForm,
  };
}

export type UploadResponse = {
  url: string;
}[];
