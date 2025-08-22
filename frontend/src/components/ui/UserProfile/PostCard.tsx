import React from 'react';
import { Link } from 'react-router-dom';

interface MockPost {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
  role: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  following: boolean;
}

interface PostCardProps {
  post: MockPost;
  user: User;
  getProfileImageSrc: (path?: string | null) => string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  formatTimeAgo: (dateString: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  user,
  getProfileImageSrc,
  handleImageError,
  formatTimeAgo
}) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        {/* Clickable Avatar */}
        <Link to={`/profile/${user.id}`} className="flex-shrink-0">
          <img
            src={getProfileImageSrc(user.profilePicture)}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
            onError={handleImageError}
          />
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {/* Clickable Name */}
            <Link 
              to={`/profile/${user.id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {user.firstName} {user.lastName}
            </Link>
            {/* Clickable Username */}
            <Link 
              to={`/profile/${user.id}`}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              @{user.username}
            </Link>
          </div>
          <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
        </div>
        
        {/* Post Menu */}
        <div className="relative">
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <button
            className={`flex items-center space-x-2 text-sm transition-colors ${
              post.isLiked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={post.isLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span>{post.likesCount}</span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.commentsCount}</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>

        {/* Bookmark Button */}
        <button className="text-gray-500 hover:text-yellow-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PostCard;