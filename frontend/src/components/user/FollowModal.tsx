/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

interface FollowUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  profileImagePath?: string | null;
  isFollowing: boolean;
}

interface FollowModal {
  isOpen: boolean;
  type: 'followers' | 'following' | null;
  users: FollowUser[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}

interface FollowModalProps {
  followModal: FollowModal;
  currentUserId?: string;
  onClose: () => void;
  onLoadMore: () => void;
  onToggleFollow: (userId: string, isFollowing: boolean) => void;
  getProfileImageSrc: (path?: string | null) => string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const FollowModalComponent: React.FC<FollowModalProps> = ({
  followModal,
  currentUserId,
  onClose,
  onLoadMore,
  onToggleFollow,
  getProfileImageSrc,
  handleImageError
}) => {
  if (!followModal.isOpen) return null;

  const handleUserClick = (userId: string) => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {followModal.type === 'followers' ? 'Followers' : 'Following'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {followModal.loading && followModal.users.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : followModal.users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {followModal.type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {followModal.users.map((modalUser) => (
                <div key={modalUser.id} className="px-6 py-4 flex items-center justify-between">
                  {/* Clickable User Info Section - Updated to use userId */}
                  <Link
                    to={`/profile/${modalUser.id}`}
                    onClick={() => handleUserClick(modalUser.id)}
                    className="flex items-center space-x-3 flex-1 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors group"
                  >
                    <img
                      src={getProfileImageSrc(modalUser.profileImagePath)}
                      alt={`${modalUser.firstName} ${modalUser.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {modalUser.firstName} {modalUser.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">@{modalUser.username}</p>
                    </div>
                  </Link>

                  {/* Follow button for other users */}
                  {modalUser.id !== currentUserId && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFollow(modalUser.id, modalUser.isFollowing);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                        modalUser.isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {modalUser.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {followModal.hasMore && (
                <div className="px-6 py-4 text-center border-t border-gray-200">
                  <button
                    onClick={onLoadMore}
                    disabled={followModal.loading}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {followModal.loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModalComponent;