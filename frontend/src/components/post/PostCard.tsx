import React, { useState } from 'react';
import type { Post } from '@/types/post';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineUser } from 'react-icons/ai';
import { FiShare, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import MediaGrid from './MediaGrid';
import PostModal from './PostModal';
import MediaModal from './MediaModal';
import EditPostModal from './EditPostModal';
import postApi from '@/services/post/apiPost';
import userApi from '@/services/user/apiUser';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, isLiked: boolean) => void;
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete, onUpdate }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount); // Thêm state cho comment count
  const [showMenu, setShowMenu] = useState(false);
  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch current user to check ownership
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        setCurrentUser(response.data);
        setIsCurrentUserPost(response.data?.id === post.author.id);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, [post.author.id]);

  // Cập nhật states khi post prop thay đổi
  React.useEffect(() => {
    setIsLiked(post.liked);
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
  }, [post.liked, post.likeCount, post.commentCount]);

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

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (onLike) {
        await onLike(post.id, isLiked);
      }
      
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handlePostClick = () => {
    setIsPostModalOpen(true);
  };

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
    setIsMediaModalOpen(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
    setShowMenu(false);
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await postApi.deletePost(post.id);
      if (onDelete) {
        onDelete(post.id);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdatePost = (updatedPost: Post) => {
    if (onUpdate) {
      onUpdate(post.id, updatedPost);
    }
    setIsEditModalOpen(false);
  };

  // Handle comment count update from PostModal
  const handleCommentCountUpdate = (postId: string, newCount: number) => {
    setCommentCount(newCount);
    // Cập nhật post object để trigger re-render nếu cần
    if (onUpdate) {
      const updatedPost = { ...post, commentCount: newCount };
      onUpdate(postId, updatedPost);
    }
  };

  const renderAvatar = () => {
    const hasAvatar = post.author.profileImagePath && 
                     post.author.profileImagePath.trim() !== '' &&
                     post.author.profileImagePath !== '/default-avatar.png';

    if (hasAvatar) {
      const imagePath = post.author.profileImagePath || '';
      const avatarUrl = imagePath.startsWith('http') 
        ? imagePath 
        : `http://localhost:8080${imagePath}`;

      return (
        <img
          src={avatarUrl}
          alt={post.author.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }

    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200">
        <AiOutlineUser className="w-6 h-6 text-white" />
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Post Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center space-x-4">
            {renderAvatar()}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 cursor-pointer transition-colors">
                  <Link to={`/profile/${post.author.id}`}>
                    {post.author.username}
                  </Link>
                </h3>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-sm text-gray-500 font-medium">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-600">@{post.author.username}</p>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BiDotsHorizontalRounded className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px] overflow-hidden">
                {isCurrentUserPost ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete Post</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      alert('Report functionality not implemented yet');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>Report Post</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="px-6 pb-4 cursor-pointer" onClick={handlePostClick}>
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Media Grid */}
        <div className="mb-4">
          <MediaGrid 
            mediaFiles={post.mediaFiles} 
            onMediaClick={handleMediaClick}
          />
        </div>

        {/* Engagement Stats */}
        {(likeCount > 0 || commentCount > 0) && (
          <div className="px-6 py-3 border-t border-gray-100 cursor-pointer" onClick={handlePostClick}>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-6">
                {likeCount > 0 && (
                  <button 
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Show likes modal
                    }}
                  >
                    <AiFillHeart className="w-4 h-4 text-red-500" />
                    <span className="font-medium">{likeCount.toLocaleString()}</span>
                  </button>
                )}
                
                {commentCount > 0 && (
                  <span className="font-medium">
                    {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-around">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-medium ${
                isLiked 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'
              }`}
            >
              {isLiked ? (
                <AiFillHeart className="w-5 h-5" />
              ) : (
                <AiOutlineHeart className="w-5 h-5" />
              )}
              <span>Like</span>
            </button>

            <button
              onClick={handlePostClick}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all font-medium"
            >
              <AiOutlineComment className="w-5 h-5" />
              <span>Comment</span>
            </button>

            <button className="flex items-center space-x-2 px-6 py-3 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-all font-medium">
              <FiShare className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post Modal với callback để update comment count */}
      <PostModal
        post={{ ...post, commentCount }} // Pass updated comment count
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onLike={onLike}
        onCommentCountUpdate={handleCommentCountUpdate}
      />

      {/* Media Modal */}
      <MediaModal
        mediaFiles={post.mediaFiles}
        initialIndex={selectedMediaIndex}
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdatePost}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
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
                onClick={handleDeletePost}
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

export default PostCard;