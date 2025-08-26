import type {PreviewFile} from "@/hooks/useFilePreview.ts";

interface PreviewTabProps {
  previewFiles: PreviewFile[];
  files: FileList | null;
}

const PreviewTab = ({ previewFiles, files }: PreviewTabProps) => {

  const truncateName = (name: string, maxLength = 12) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf(".");
    const ext = extIndex !== -1 ? name.slice(extIndex) : "";
    const base = name.slice(0, maxLength - ext.length - 3);
    return `${base}...${ext}`;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {previewFiles.map((preview, idx) => {
        if (!preview) return null;
        
        const file = preview.file;
        const type = file.type;

        if (type.startsWith("image/")) {
          // ✅ Image preview
          return (
            <img
              key={idx}
              src={preview.url}
              alt={file.name}
              className="h-12 w-12 object-cover rounded-md"
            />
          );
        } else if (type === "application/pdf") {
          // ✅ PDF preview
          return (
            <div
              key={idx}
              className="w-20 h-20 flex items-center justify-center border rounded bg-gray-100 text-xs text-center p-1"
            >
              📄 {truncateName(file.name)}
            </div>
          );
        } else if (
          type === "application/msword" ||
          type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // ✅ Word preview
          return (
            <div
              key={idx}
              className="w-20 h-20 flex items-center justify-center border rounded bg-blue-100 text-xs text-center p-1"
            >
              📝 {truncateName(file.name)}
            </div>
          );
        } else if (
          type === "application/vnd.ms-excel" ||
          type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          // ✅ Excel preview
          return (
            <div
              key={idx}
              className="w-20 h-20 flex items-center justify-center border rounded bg-green-100 text-xs text-center p-1"
            >
              📊 {truncateName(file.name)}
            </div>
          );
        } else if (type.startsWith("text/")) {
          // ✅ Plain text preview
          return (
            <div
              key={idx}
              className="w-20 h-20 flex items-center justify-center border rounded bg-gray-200 text-xs text-center p-1"
            >
              📃 {truncateName(file.name)}
            </div>
          );
        } else {
          // ❓ Unknown file type
          return (
            <div
              key={idx}
              className="w-20 h-20 flex items-center justify-center border rounded bg-gray-300 text-xs text-center p-1"
            >
              📦 {truncateName(file.name)}
            </div>
          );
        }
      })}
    </div>
  );
};

export default PreviewTab;
