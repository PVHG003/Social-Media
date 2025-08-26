import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Post, Comment } from '@/types/post';
import { IoClose } from 'react-icons/io5';
import { AiOutlineHeart, AiFillHeart, AiOutlineSend, AiOutlineUser } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import MediaGrid from './MediaGrid';
import CommentItem from './CommentItem';
import commentApi from '@/services/post/apiComment';
import userApi from '@/services/user/apiUser';
import { Link } from 'react-router-dom';

interface PostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (postId: string, isLiked: boolean) => void;
  onCommentCountUpdate?: (postId: string, newCount: number) => void;
  onLikeCountUpdate?: (postId: string, newIsLiked: boolean, newLikeCount: number) => void;
}

const PostModal: React.FC<PostModalProps> = ({ 
  post, 
  isOpen, 
  onClose, 
  onLike, 
  onCommentCountUpdate,
  onLikeCountUpdate 
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Pagination states
  const [commentsPage, setCommentsPage] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      resetAndFetchComments();
      setIsLiked(post.liked);
      setLikeCount(post.likeCount);
      setCommentCount(post.commentCount);
    } else {
      document.body.style.overflow = 'unset';
      resetComments();
      
      if (onLikeCountUpdate && (isLiked !== post.liked || likeCount !== post.likeCount)) {
        onLikeCountUpdate(post.id, isLiked, likeCount);
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, post.id, post.liked, post.likeCount, post.commentCount]);

  const resetComments = () => {
    setComments([]);
    setCommentsPage(0);
    setHasMoreComments(true);
  };

  const resetAndFetchComments = () => {
    resetComments();
    fetchComments(0, false);
  };

  const fetchComments = async (page: number = 0, append: boolean = false) => {
    if (loadingComments) return;
    
    setLoadingComments(true);
    try {
      const response = await commentApi.getCommentsByPost(post.id, page, 10);
      
      if (response.data && Array.isArray(response.data)) {
        const newComments = response.data;
        
        if (append) {
          setComments(prev => [...prev, ...newComments]);
        } else {
          setComments(newComments);
        }
        
        setCommentsPage(page);
        setHasMoreComments(page < (response.totalPages || 1) - 1);
      } else {
        setComments(append ? comments : []);
        setHasMoreComments(false);
      }
      
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (!append) {
        setComments([]);
      }
      setHasMoreComments(false);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (!modalBodyRef.current || loadingComments || !hasMoreComments) return;
    
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchComments(commentsPage + 1, true);
    }
  }, [commentsPage, loadingComments, hasMoreComments]);

  useEffect(() => {
    const container = modalBodyRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await commentApi.createComment(post.id, { content: newComment.trim() });
      
      if (response.data) {
        setComments(prev => [response.data!, ...prev]);
        const newCommentCount = commentCount + 1;
        setCommentCount(newCommentCount);
        
        if (onCommentCountUpdate) {
          onCommentCountUpdate(post.id, newCommentCount);
        }
        
        setNewComment('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    try {
      if (onLike) {
        await onLike(post.id, isLiked);
        
        const newIsLiked = !isLiked;
        const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
        
        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);
        
        if (onLikeCountUpdate) {
          onLikeCountUpdate(post.id, newIsLiked, newLikeCount);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle comment update
  const handleCommentUpdate = (commentId: string, updatedComment: Comment) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? updatedComment : comment
    ));
  };

  // Handle comment delete
  const handleCommentDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    const newCommentCount = commentCount - 1;
    setCommentCount(newCommentCount);
    
    if (onCommentCountUpdate) {
      onCommentCountUpdate(post.id, newCommentCount);
    }
  };

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

  const renderAvatar = (profileImagePath?: string | null, username?: string, size: string = 'w-10 h-10') => {
    const hasAvatar = profileImagePath && 
                     profileImagePath.trim() !== '' &&
                     profileImagePath !== 'http://localhost:8080/uploads/images/default-avatar.png' &&
                     !profileImagePath.includes('http://localhost:8080/uploads/images/default-avatar.png');

    if (hasAvatar) {
      const avatarUrl = profileImagePath!.startsWith('http') 
        ? profileImagePath 
        : `http://localhost:8080${profileImagePath}`;

      return (
        <img
          src={avatarUrl}
          alt={username || 'User'}
          className={`${size} rounded-full object-cover border-2 border-gray-200`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-avatar')) {
              const iconDiv = document.createElement('div');
              iconDiv.className = `${size} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200 fallback-avatar`;
              iconDiv.innerHTML = `<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>`;
              parent.appendChild(iconDiv);
            }
          }}
        />
      );
    }

    return (
      <div className={`${size} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200`}>
        <AiOutlineUser className="w-6 h-6 text-white" />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl border border-gray-100">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {renderAvatar(post.author.profileImagePath, post.author.username)}
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                <Link to={`/profile/${post.author.id}`}>
                  @{post.author.username}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <BiDotsHorizontalRounded className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={modalBodyRef}
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: 'calc(95vh - 200px)' }}
        >
          {/* Post Content */}
          <div className="p-6">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>
            
            <MediaGrid mediaFiles={post.mediaFiles} />

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                {likeCount > 0 && (
                  <button className="hover:text-blue-600 transition-colors">
                    <span className="flex items-center space-x-1">
                      <AiFillHeart className="w-4 h-4 text-red-500" />
                      <span className="font-medium">{likeCount.toLocaleString()}</span>
                    </span>
                  </button>
                )}
                
                {commentCount > 0 && (
                  <span className="font-medium">
                    {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-around py-3 border-y border-gray-100 bg-gray-50 rounded-lg mb-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all font-medium ${
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
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pb-4">
            <div className="px-6 mb-4">
              <h4 className="font-bold text-gray-900 text-lg">Comments</h4>
            </div>
            
            <div className="space-y-4 px-6">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <CommentItem
                    key={`${comment.id}-${index}`}
                    comment={comment}
                    currentUserId={currentUser?.id}
                    onUpdate={handleCommentUpdate}
                    onDelete={handleCommentDelete}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <p className="text-gray-500 text-lg font-medium">No comments yet</p>
                  <p className="text-gray-400">Be the first to comment!</p>
                </div>
              )}
              
              {loadingComments && (
                <div className="flex justify-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {!loadingComments && hasMoreComments && comments.length > 0 && (
                <div className="text-center py-4">
                  <button
                    onClick={() => fetchComments(commentsPage + 1, true)}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Load more comments...
                  </button>
                </div>
              )}
              
              {!hasMoreComments && comments.length > 10 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  🎉 You've reached the end of comments
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Input - Fixed at bottom */}
        <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0">
          <form onSubmit={handleSubmitComment} className="flex space-x-4">
            {renderAvatar(currentUser?.profileImagePath, currentUser?.username, 'w-10 h-10')}
            <div className="flex-1 flex space-x-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isSubmittingComment ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <AiOutlineSend className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;