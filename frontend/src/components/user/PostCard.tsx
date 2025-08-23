import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AiOutlineHeart, 
  AiFillHeart, 
  AiOutlineComment, 
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';

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
            <BsThreeDots className="w-5 h-5" />
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
            {post.isLiked ? (
              <AiFillHeart className="w-5 h-5" />
            ) : (
              <AiOutlineHeart className="w-5 h-5" />
            )}
            <span>{post.likesCount}</span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <AiOutlineComment className="w-5 h-5" />
            <span>{post.commentsCount}</span>
          </button>
        </div>
        </div>
    </div>
  );
};

export default PostCard;