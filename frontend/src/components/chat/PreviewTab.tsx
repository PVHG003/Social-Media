const PreviewTab = (props: {
  previewFiles: string[];
  files: FileList | null;
}) => {
  const { previewFiles, files } = props;

  const truncateName = (name: string, maxLength = 12) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf(".");
    const ext = extIndex !== -1 ? name.slice(extIndex) : "";
    const base = name.slice(0, maxLength - ext.length - 3);
    return `${base}...${ext}`;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {previewFiles.map((src, idx) => {
        const file = files?.[idx]; // match preview with File object
        if (!file) return null;

        const type = file.type;

        if (type.startsWith("image/")) {
          // ✅ Image preview
          return (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className="w-20 h-20 object-cover rounded"
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
