// import type { AttachmentResponse } from "@/api";

// const AttachmentGrid = ({
//   attachments,
// }: {
//   attachments: AttachmentResponse[];
// }) => {
//   const imageAttachments = attachments.filter((att) =>
//     att.contentType?.startsWith("image/")
//   );
//   const otherAttachments = attachments.filter(
//     (att) => !att.contentType?.startsWith("image/")
//   );

//   // Grid layout logic for images
//   const renderImageGrid = () => {
//     const count = imageAttachments.length;

//     if (count === 1) {
//       return (
//         <img
//           src={imageAttachments[0].filePath}
//           alt="attachment"
//           className="rounded-lg w-full max-w-sm"
//         />
//       );
//     }

//     if (count === 2) {
//       return (
//         <div className="grid grid-cols-2 gap-2">
//           {imageAttachments.map((att) => (
//             <img
//               key={att.attachmentId}
//               src={att.filePath}
//               alt="attachment"
//               className="rounded-lg w-full h-40 object-cover"
//             />
//           ))}
//         </div>
//       );
//     }

//     if (count === 3 || count === 4) {
//       return (
//         <div className="grid grid-cols-2 gap-2">
//           {imageAttachments.slice(0, 4).map((att) => (
//             <img
//               key={att.attachmentId}
//               src={att.filePath}
//               alt="attachment"
//               className="rounded-lg w-full h-40 object-cover"
//             />
//           ))}
//         </div>
//       );
//     }

//     if (count > 4) {
//       return (
//         <div className="grid grid-cols-2 gap-2 relative">
//           {imageAttachments.slice(0, 4).map((att, idx) => (
//             <div key={att.attachmentId} className="relative">
//               <img
//                 src={att.filePath}
//                 alt="attachment"
//                 className="rounded-lg w-full h-40 object-cover"
//               />
//               {idx === 3 && (
//                 <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg text-white text-xl font-bold">
//                   +{count - 4}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="mt-2 space-y-2">
//       {imageAttachments.length > 0 && renderImageGrid()}

//       {otherAttachments.map((att) => (
//         <div key={att.attachmentId} className="mt-2">
//           {att.contentType?.startsWith("video/") ? (
//             <video controls className="rounded-lg max-w-sm">
//               <source src={att.filePath} type={att.contentType} />
//               Your browser does not support the video tag.
//             </video>
//           ) : (
//             <a
//               href={att.filePath}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="underline text-xs block"
//             >
//               {att.filePath?.split("/").pop()}
//             </a>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AttachmentGrid;

import type { AttachmentResponse } from "@/api";

const AttachmentGrid = ({
  attachments,
}: {
  attachments: AttachmentResponse[];
}) => {
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((att) => {
        if (att.contentType?.startsWith("image/")) {
          return (
            <img
              key={att.attachmentId}
              src={att.filePath}
              alt="attachment"
              className="rounded-lg w-full max-w-sm"
            />
          );
        }

        if (att.contentType?.startsWith("video/")) {
          return (
            <video
              key={att.attachmentId}
              controls
              className="relative w-full max-w-xl rounded-lg overflow-hidden"
            >
                <source src={att.filePath} type={att.contentType} />
                Your browser does not support the video tag.
            </video>
          );
        }

        return (
          <a
            key={att.attachmentId}
            href={att.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-lg p-3 bg-gray-100 hover:bg-gray-200 transition-colors w-64"
          >
            <div className="flex items-center gap-3">
              {/* File icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-300 text-gray-700">
                📄
              </div>

              {/* File info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {att.filePath?.split("/").pop()}
                </p>
                <p className="text-xs text-gray-500">Click to open</p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default AttachmentGrid;
