import React, { useEffect, useState } from "react";

export const useFilePreview = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setFiles(selectedFiles);

    const urls = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(urls);
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const clearFiles = () => {
    setFiles(null);
    setPreviews([]);
  };

  return { files, previews, handleFileChange, clearFiles };
};
