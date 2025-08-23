import React, { useState, useEffect } from 'react';
import type { MediaFile } from '@/types/post';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';

interface MediaModalProps {
  mediaFiles: MediaFile[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ mediaFiles, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const getMediaUrl = (url: string) => {
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  };

  const toggleVideoPlay = () => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const currentMedia = mediaFiles[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
      >
        <IoClose className="w-6 h-6 text-white" />
      </button>

      {/* Navigation Buttons */}
      {mediaFiles.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <IoChevronBack className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <IoChevronForward className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Media Content */}
      <div className="max-w-4xl max-h-screen w-full h-full flex items-center justify-center p-4">
        {currentMedia.mediaType === 'IMAGE' ? (
          <img
            src={getMediaUrl(currentMedia.publicUrl)}
            alt={currentMedia.originalFilename}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="relative">
            <video
              id="modal-video"
              src={getMediaUrl(currentMedia.publicUrl)}
              controls
              className="max-w-full max-h-full object-contain"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
          </div>
        )}
      </div>

      {/* Media Counter */}
      {mediaFiles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {mediaFiles.length}
        </div>
      )}

      {/* Media Info */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        {currentMedia.originalFilename}
      </div>
    </div>
  );
};

export default MediaModal;