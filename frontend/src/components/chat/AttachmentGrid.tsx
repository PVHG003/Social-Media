import type {AttachmentResponse} from "@/api";

const BASE_URL = "http://localhost:8080/";

const AttachmentGrid = ({attachment, onMediaLoad,}: {
  attachment: AttachmentResponse;
  onMediaLoad?: () => void;
}) => {
  if (attachment.contentType?.startsWith("image/")) {
    return (
      <img
        key={attachment.attachmentId}
        src={`${BASE_URL}${attachment.filePath}`}
        alt="attachment"
        className="rounded-lg w-full max-w-sm"
        onLoad={onMediaLoad}
        onError={onMediaLoad}
      />
    );
  }

  if (attachment.contentType?.startsWith("video/")) {
    return (
      <video
        key={attachment.attachmentId}
        src={`${BASE_URL}${attachment.filePath}`}
        typeof={attachment.contentType}
        controls
        className="relative w-full max-w-xl rounded-lg overflow-hidden"
        onLoadedMetadata={onMediaLoad}
        onError={onMediaLoad}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // Default (other files)
  return (
    <a
      key={attachment.attachmentId}
      href={`${BASE_URL}${attachment.filePath}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg p-3 bg-gray-100 hover:bg-gray-200 transition-colors w-64"
      title={attachment.filePath?.split("/").pop()}
      onClick={onMediaLoad}
    >
      <div className="flex items-center gap-3">
        {/* File icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-300 text-gray-700">
          📄
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {attachment.filePath?.split("/").pop()}
          </p>
          <p className="text-xs text-gray-500 truncate">Click to open</p>
        </div>
      </div>
    </a>
  );
};

export default AttachmentGrid;
