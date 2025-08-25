import type { AttachmentResponse } from "@/api";

const BASE_URL = "http://localhost:8080/";

const AttachmentGrid = ({
  attachments,
  onMediaLoad,
}: {
  attachments: AttachmentResponse[];
  onMediaLoad?: () => void; // optional callback for scroll-to-bottom
}) => {
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((att) => {
        if (att.contentType?.startsWith("image/")) {
          return (
            <img
              key={att.attachmentId}
              src={`${BASE_URL}${att.filePath}`}
              alt="attachment"
              className="rounded-lg w-full max-w-sm"
              onLoad={onMediaLoad} // ✅ trigger after image loads
              onError={onMediaLoad}
            />
          );
        }

        if (att.contentType?.startsWith("video/")) {
          return (
            <video
              key={att.attachmentId}
              src={`${BASE_URL}${att.filePath}`}
              typeof={att.contentType}
              controls
              className="relative w-full max-w-xl rounded-lg overflow-hidden"
              onLoadedMetadata={onMediaLoad} // ✅ trigger after video metadata loads
              onError={onMediaLoad}
            >
              Your browser does not support the video tag.
            </video>
          );
        }

        // Default (other files)
        return (
          <a
            key={att.attachmentId}
            href={`${BASE_URL}${att.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-lg p-3 bg-gray-100 hover:bg-gray-200 transition-colors w-64"
            title={att.filePath?.split("/").pop()} // Show full name on hover
            onClick={onMediaLoad} // not strictly needed, but keeps behavior consistent
          >
            <div className="flex items-center gap-3">
              {/* File icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-300 text-gray-700">
                📄
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {att.filePath?.split("/").pop()}
                </p>
                <p className="text-xs text-gray-500 truncate">Click to open</p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default AttachmentGrid;
