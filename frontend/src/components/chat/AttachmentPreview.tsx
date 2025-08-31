import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface AttachmentPreviewProps {
  files: File[] | null;
  onRemove: (index: number) => void;
}

const AttachmentPreview = ({ files, onRemove }: AttachmentPreviewProps) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="flex gap-2 p-2 flex-wrap">
      {Array.from(files).map((file, index) => {
        const isImage = file.type.startsWith("image/");

        return (
          <Card
            key={index}
            className="relative w-20 h-20 border rounded overflow-hidden flex items-center justify-center"
          >
            {/* Remove button */}
            <button
              onClick={() => onRemove(index)}
              className="absolute top-0 right-0 bg-black/50 text-white rounded-bl px-1 hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>

            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="object-cover w-full h-full"
                onLoad={(e) =>
                  URL.revokeObjectURL((e.target as HTMLImageElement).src)
                }
              />
            ) : (
              <div className="text-xs text-center p-1 break-words">
                {file.name}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default AttachmentPreview;
