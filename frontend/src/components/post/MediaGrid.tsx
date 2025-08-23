import React, { useState } from 'react';
import type { MediaFile } from '@/types/post';
import { FiPlay } from 'react-icons/fi';
import MediaModal from './MediaModal';

interface MediaGridProps {
  mediaFiles: MediaFile[];
  onMediaClick?: (index: number) => void; // Callback để parent handle media click
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaFiles, onMediaClick }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  
  if (mediaFiles.length === 0) return null;

  const getMediaUrl = (url: string) => {
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  const handleMediaClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn trigger post modal
    if (onMediaClick) {
      onMediaClick(index); // Gọi callback từ parent
    } else {
      setSelectedMediaIndex(index); // Fallback: mở media modal local
    }
  };

  const closeMediaModal = () => {
    setSelectedMediaIndex(null);
  };

  const renderSingleMedia = (media: MediaFile, index: number) => (
    <div 
      key={media.id}
      className="relative w-full h-96 cursor-pointer group overflow-hidden rounded-lg"
      onClick={(e) => handleMediaClick(index, e)}
    >
      {media.mediaType === 'IMAGE' ? (
        <img
          src={getMediaUrl(media.publicUrl)}
          alt={media.originalFilename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <>
          <video
            src={getMediaUrl(media.publicUrl)}
            className="w-full h-full object-cover"
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
            <FiPlay className="w-16 h-16 text-white" />
          </div>
        </>
      )}
    </div>
  );

  const renderTwoMedia = () => (
    <div className="grid grid-cols-2 gap-1 h-96">
      {mediaFiles.slice(0, 2).map((media, index) => (
        <div 
          key={media.id}
          className="relative cursor-pointer group overflow-hidden rounded-lg"
          onClick={(e) => handleMediaClick(index, e)}
        >
          {media.mediaType === 'IMAGE' ? (
            <img
              src={getMediaUrl(media.publicUrl)}
              alt={media.originalFilename}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <>
              <video
                src={getMediaUrl(media.publicUrl)}
                className="w-full h-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <FiPlay className="w-12 h-12 text-white" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderThreeMedia = () => (
    <div className="grid grid-cols-2 gap-1 h-96">
      <div 
        className="relative cursor-pointer group overflow-hidden rounded-lg"
        onClick={(e) => handleMediaClick(0, e)}
      >
        {mediaFiles[0].mediaType === 'IMAGE' ? (
          <img
            src={getMediaUrl(mediaFiles[0].publicUrl)}
            alt={mediaFiles[0].originalFilename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <video
              src={getMediaUrl(mediaFiles[0].publicUrl)}
              className="w-full h-full object-cover"
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
              <FiPlay className="w-12 h-12 text-white" />
            </div>
          </>
        )}
      </div>
      
      <div className="grid grid-rows-2 gap-1">
        {mediaFiles.slice(1, 3).map((media, index) => (
          <div 
            key={media.id}
            className="relative cursor-pointer group overflow-hidden rounded-lg"
            onClick={(e) => handleMediaClick(index + 1, e)}
          >
            {media.mediaType === 'IMAGE' ? (
              <img
                src={getMediaUrl(media.publicUrl)}
                alt={media.originalFilename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                <video
                  src={getMediaUrl(media.publicUrl)}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                  <FiPlay className="w-8 h-8 text-white" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMultipleMedia = () => (
    <div className="grid grid-cols-2 gap-1 h-96">
      <div 
        className="relative cursor-pointer group overflow-hidden rounded-lg"
        onClick={(e) => handleMediaClick(0, e)}
      >
        {mediaFiles[0].mediaType === 'IMAGE' ? (
          <img
            src={getMediaUrl(mediaFiles[0].publicUrl)}
            alt={mediaFiles[0].originalFilename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <video
              src={getMediaUrl(mediaFiles[0].publicUrl)}
              className="w-full h-full object-cover"
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
              <FiPlay className="w-12 h-12 text-white" />
            </div>
          </>
        )}
      </div>
      
      <div className="grid grid-rows-2 gap-1">
        {mediaFiles.slice(1, 3).map((media, index) => (
          <div 
            key={media.id}
            className="relative cursor-pointer group overflow-hidden rounded-lg"
            onClick={(e) => handleMediaClick(index + 1, e)}
          >
            {media.mediaType === 'IMAGE' ? (
              <img
                src={getMediaUrl(media.publicUrl)}
                alt={media.originalFilename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                <video
                  src={getMediaUrl(media.publicUrl)}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                  <FiPlay className="w-8 h-8 text-white" />
                </div>
              </>
            )}
            {index === 1 && mediaFiles.length > 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{mediaFiles.length - 3}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedia = () => {
    switch (mediaFiles.length) {
      case 1:
        return renderSingleMedia(mediaFiles[0], 0);
      case 2:
        return renderTwoMedia();
      case 3:
        return renderThreeMedia();
      default:
        return renderMultipleMedia();
    }
  };

  return (
    <div className="my-3">
      {renderMedia()}
      
      {/* Chỉ render MediaModal khi không có onMediaClick callback */}
      {!onMediaClick && selectedMediaIndex !== null && (
        <MediaModal
          mediaFiles={mediaFiles}
          initialIndex={selectedMediaIndex}
          isOpen={selectedMediaIndex !== null}
          onClose={closeMediaModal}
        />
      )}
    </div>
  );
};

export default MediaGrid;