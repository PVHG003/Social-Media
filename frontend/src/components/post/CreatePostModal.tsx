import React, { useState, useRef } from 'react';
import { IoClose, IoImages, IoVideocam, IoTrash } from 'react-icons/io5';
import { AiOutlineSend } from 'react-icons/ai';
import { FiPlay, FiImage } from 'react-icons/fi';
import postApi from '@/services/post/apiPost';
import type { Post } from '@/types/post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  currentUser: any;
}

interface MediaPreview {
  id: string;
  file: File;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  currentUser
}) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setContent('');
      setMediaFiles([]);
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB');
        return;
      }

      const mediaType = file.type.startsWith('image/') ? 'IMAGE' : 
                       file.type.startsWith('video/') ? 'VIDEO' : null;
      
      if (!mediaType) {
        setError('Only image and video files are allowed');
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);
      
      setMediaFiles(prev => [...prev, {
        id,
        file,
        url,
        type: mediaType
      }]);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => {
      const updated = prev.filter(media => media.id !== id);
      // Clean up object URL
      const mediaToRemove = prev.find(media => media.id === id);
      if (mediaToRemove) {
        URL.revokeObjectURL(mediaToRemove.url);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && mediaFiles.length === 0) {
      setError('Please add some content or media files');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const files = mediaFiles.length > 0 ? mediaFiles.map(media => media.file) : undefined;
      const postContent = content.trim() || undefined;
    
      const response = await postApi.createPost(postContent, files);
      
      if (response.data) {
        onPostCreated(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      // Clean up object URLs
      mediaFiles.forEach(media => {
        URL.revokeObjectURL(media.url);
      });
      onClose();
    }
  };

  const renderMediaPreview = () => {
    if (mediaFiles.length === 0) return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Media Files ({mediaFiles.length})</h4>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            disabled={isUploading}
          >
            Add More
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mediaFiles.map((media) => (
            <div key={media.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {media.type === 'IMAGE' ? (
                <img
                  src={media.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <FiPlay className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeMedia(media.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
              >
                <IoTrash className="w-3 h-3" />
              </button>
              
              {/* File type indicator */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                {media.type === 'IMAGE' ? (
                  <FiImage className="w-3 h-3" />
                ) : (
                  <FiPlay className="w-3 h-3" />
                )}
                <span>{media.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* User Info */}
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {currentUser?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
                </h3>
                <p className="text-sm text-gray-600">@{currentUser?.username || 'username'}</p>
              </div>
            </div>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6">
            {/* Text Content */}
            <div className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-0 py-2 border-none resize-none focus:outline-none text-lg placeholder-gray-500"
                rows={4}
                maxLength={2000}
                disabled={isUploading}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {content.length}/2000
              </div>
            </div>

            {/* Media Preview */}
            {renderMediaPreview()}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            {/* Media Upload Options */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  disabled={isUploading}
                >
                  <IoImages className="w-5 h-5" />
                  <span>Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  disabled={isUploading}
                >
                  <IoVideocam className="w-5 h-5" />
                  <span>Videos</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {mediaFiles.length > 0 && `${mediaFiles.length} file(s) selected`}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <AiOutlineSend className="w-5 h-5" />
                )}
                <span>{isUploading ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CreatePostModal;