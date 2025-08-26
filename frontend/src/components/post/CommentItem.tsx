import React, { useState } from 'react';
import type { Comment } from '@/types/post';
import { AiOutlineUser, AiOutlineEdit, AiOutlineDelete, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import commentApi from '@/services/post/apiComment';
import { Link } from 'react-router-dom';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onUpdate?: (commentId: string, updatedComment: Comment) => void;
  onDelete?: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  currentUserId, 
  onUpdate, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = currentUserId === comment.author.id;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent.trim() === comment.content) {
      handleCancelEdit();
      return;
    }

    setIsUpdating(true);
    try {
      const response = await commentApi.updateComment(comment.id, {
        content: editContent.trim()
      });

      if (response.data && onUpdate) {
        onUpdate(comment.id, response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await commentApi.deleteComment(comment.id);
      if (onDelete) {
        onDelete(comment.id);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderAvatar = () => {
    const hasAvatar = comment.author.profileImagePath && 
                     comment.author.profileImagePath.trim() !== '' &&
                     comment.author.profileImagePath !== 'http://localhost:8080/uploads/images/default-avatar.png' &&
                     !comment.author.profileImagePath.includes('/default-avatar.png');

    if (hasAvatar) {
      const avatarUrl = comment.author.profileImagePath!.startsWith('http') 
        ? comment.author.profileImagePath 
        : `http://localhost:8080${comment.author.profileImagePath}`;

      return (
        <img
          src={avatarUrl}
          alt={comment.author.username}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200">
        <AiOutlineUser className="w-5 h-5 text-white" />
      </div>
    );
  };

  return (
    <>
      <div className="flex space-x-3">
        {renderAvatar()}
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-lg relative group">
            {/* Menu button for owner */}
            {isOwner && !isEditing && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <BiDotsHorizontalRounded className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {/* Dropdown Menu */}
            {showMenu && isOwner && (
              <div className="absolute right-2 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px] overflow-hidden">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <AiOutlineEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <AiOutlineDelete className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-sm text-gray-900">
                <Link to={`/profile/${comment.author.id}`}>
                  {comment.author.username}
                </Link>
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.updatedAt !== comment.createdAt && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={2}
                  disabled={isUpdating}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isUpdating || !editContent.trim()}
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <AiOutlineSave className="w-3 h-3" />
                    )}
                    <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <AiOutlineClose className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
            )}
          </div>
          
          {/* Comment Actions */}
          {!isEditing && (
            <div className="flex items-center space-x-4 mt-2 ml-4">
              <button className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">
                Like
              </button>
              <button className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">
                Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Comment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isDeleting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default CommentItem;