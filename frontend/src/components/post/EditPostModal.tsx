import React, { useState, useEffect } from 'react';
import type { Post } from '@/types/post';
import { IoClose } from 'react-icons/io5';
import { AiOutlineSave } from 'react-icons/ai';
import postApi from '@/services/post/apiPost';

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPost: Post) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, isOpen, onClose, onUpdate }) => {
  const [content, setContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setContent(post.content);
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, post.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    if (content.trim() === post.content) {
      onClose();
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await postApi.updatePost(post.id, {
        content: content.trim()
      });

      if (response.data) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
          <button
            onClick={handleClose}
            disabled={isUpdating}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <IoClose className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Content */}
          <div className="flex-1 p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="What's on your mind?"
                disabled={isUpdating}
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {content.length}/2000 characters
                </span>
                {error && (
                  <span className="text-sm text-red-500">{error}</span>
                )}
              </div>
            </div>

            {/* Media Files Display (Read-only) */}
            {post.mediaFiles && post.mediaFiles.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Files (cannot be changed)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 opacity-70">
                  {post.mediaFiles.slice(0, 6).map((file, index) => (
                    <div key={file.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.mediaType === 'IMAGE' ? (
                        <img
                          src={file.publicUrl.startsWith('http') ? file.publicUrl : `http://localhost:8080${file.publicUrl}`}
                          alt={file.originalFilename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Video</span>
                        </div>
                      )}
                      {index === 5 && post.mediaFiles.length > 6 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">+{post.mediaFiles.length - 6}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUpdating}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !content.trim() || content.trim() === post.content}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <AiOutlineSave className="w-4 h-4" />
                <span>{isUpdating ? 'Updating...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;