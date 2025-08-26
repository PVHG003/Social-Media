import React, { useEffect, useState } from "react";

export type PreviewFile = {
  file: File;
  url: string;
};

export const useFilePreview = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    console.log(selectedFiles);

    const newFiles = Array.from(selectedFiles);
    const newPreviews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles(selectedFiles);
    setPreviews(newPreviews);

    console.log(files)
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const clearFiles = () => {
    setFiles(null);
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
  };

  return { files, previews, handleFileChange, clearFiles };
};
