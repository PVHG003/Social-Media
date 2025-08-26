/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MdEdit, 
  MdLock, 
  MdPersonAdd, 
  MdPersonRemove, 
  MdMessage,
  MdEmail,
  MdCalendarToday
} from 'react-icons/md';
import { FaUser, FaUserPlus } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import TopHeader from '../ui/NavBar/NavBar';
import EditProfileModal from './EditProfileModal';
import FollowModalComponent from './FollowModal';
import PostCard from '../post/PostCard';
import { useAuth } from '../../context/authentication/AuthContext';

import { useUserProfile } from '../../hooks/user/useUserProfile';
import { useUserPosts } from '../../hooks/user/useUserPosts';
import { useFollow } from '../../hooks/user/useFollow';
import { useProfileEdit } from '../../hooks/user/useProfileEdit';

const UserProfile = () => {
  const { username, userId } = useParams<{ username?: string; userId?: string }>();
  const authContext = useAuth();
  
  const { user, loading, error, isCurrentUser, refetchUser, updateUser } = useUserProfile(userId);
  const { 
    posts, 
    postsLoading, 
    postsError, 
    hasMore, 
    loadingMore, 
    fetchUserPosts, 
    handleLoadMore, 
    handleLike, 
    handleDeletePost, 
    handleUpdatePost 
  } = useUserPosts();
  
  const {
    followLoading,
    followModal,
    handleFollowToggle,
    openFollowModal,
    closeFollowModal,
    loadMoreUsers,
    handleModalFollow
  } = useFollow();

  const {
    showEditModal,
    editForm,
    saveLoading,
    imageUploading,
    selectedFile,
    previewUrl,
    initializeEditForm,
    handleEditProfile,
    handleCloseModal,
    handleInputChange,
    handleFileSelect,
    handleRemoveImage,
    handleSaveProfile,
    handleChangePassword
  } = useProfileEdit();

  const isAuthenticated = !!authContext?.token;

  const getProfileImageSrc = (profileImagePath?: string | null): string => {
    if (!profileImagePath || profileImagePath.trim() === '') {
      return 'http://localhost:8080/uploads/images/default-avatar.png';
    }
    return profileImagePath.startsWith('http') ? profileImagePath : `http://localhost:8080${profileImagePath}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'http://localhost:8080/uploads/images/default-avatar.png';
  };

  useEffect(() => {
    if (user) {
      initializeEditForm(user);
    }
  }, [user, initializeEditForm]);

  useEffect(() => {
    if (user) {
      fetchUserPosts(user.id, 0, false);
    }
  }, [user, fetchUserPosts]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AiOutlineLoading3Quarters className="inline-block animate-spin h-8 w-8 text-blue-600 mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
            <p className="text-gray-500">The user profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-6">
          <div className="px-6 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src={getProfileImageSrc(user.profilePicture)}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                  onError={handleImageError}
                />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xl text-blue-100 mb-2">@{user.username}</p>
                {user.email && <p className="text-blue-200 mb-4">{user.email}</p>}
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user.following && !isCurrentUser && (
                    <div className="bg-green-500 bg-opacity-80 px-4 py-2 rounded-full">
                      <span className="font-medium">Following</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isCurrentUser ? (
                  <>
                    <button 
                      onClick={() => handleEditProfile(user, isCurrentUser)}
                      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      <MdEdit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    
                    <button 
                      onClick={handleChangePassword}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <MdLock className="w-4 h-4 mr-2" />
                      Change Password
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleFollowToggle(user, isCurrentUser, updateUser)}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                        user?.following
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-white text-blue-600 hover:bg-gray-100'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? (
                        <>
                          <AiOutlineLoading3Quarters className="inline-block animate-spin h-4 w-4 mr-2" />
                          Loading...
                        </>
                      ) : user?.following ? (
                        <>
                          <MdPersonRemove className="w-4 h-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <MdPersonAdd className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </button>
                    
                    <Link
                      to={`/chat/${user?.id}`}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center flex items-center justify-center"
                    >
                      <MdMessage className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6">
          <button
            onClick={() => openFollowModal('followers', user.id)}
            className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow block w-full"
          >
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{user.followersCount.toLocaleString()}</div>
            <div className="text-sm md:text-base text-gray-600">Followers</div>
          </button>
          
          <button
            onClick={() => openFollowModal('following', user.id)}
            className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow block w-full"
          >
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">{user.followingCount.toLocaleString()}</div>
            <div className="text-sm md:text-base text-gray-600">Following</div>
          </button>
          
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">{posts.length}</div>
            <div className="text-sm md:text-base text-gray-600">Posts</div>
          </div>
        </div>

        {/* Bio Section */}
        {user.bio && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Profile Details */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.email && (
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                  <MdEmail className="w-4 h-4 mr-2" />
                  Email Address
                </h4>
                <p className="text-gray-600">{user.email}</p>
              </div>
            )}
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                <FaUser className="w-4 h-4 mr-2" />
                Username
              </h4>
              <p className="text-gray-600">@{user.username}</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                <MdCalendarToday className="w-4 h-4 mr-2" />
                Member Since
              </h4>
              <p className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isCurrentUser ? 'My Posts' : `${user.firstName}'s Posts`}
            </h3>
            <p className="text-gray-600 text-lg">{posts.length} posts</p>
          </div>
          
          {postsLoading && posts.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AiOutlineLoading3Quarters className="inline-block animate-spin h-8 w-8 text-blue-600 mb-4" />
                <p className="text-gray-600 text-lg">Loading posts...</p>
              </div>
            </div>
          )}

          {postsError && (
            <div className="text-center bg-white rounded-xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600 mb-4 text-lg">{postsError}</p>
              <button 
                onClick={() => user && fetchUserPosts(user.id, 0, false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {posts.length > 0 && (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                />
              ))}

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => handleLoadMore(user.id)}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loadingMore ? (
                      <span className="flex items-center space-x-2">
                        <AiOutlineLoading3Quarters className="inline-block animate-spin h-4 w-4" />
                        <span>Loading...</span>
                      </span>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {!postsLoading && !postsError && posts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="text-gray-400 text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                {isCurrentUser ? 'No posts yet' : `${user.firstName} hasn't posted anything yet`}
              </h3>
              <p className="text-gray-500 text-lg">
                {isCurrentUser ? 'Create your first post to get started!' : 'Check back later for new posts.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal && isCurrentUser}
        user={user}
        editForm={editForm}
        previewUrl={previewUrl}
        selectedFile={selectedFile}
        saveLoading={saveLoading}
        imageUploading={imageUploading}
        onClose={() => handleCloseModal(user)}
        onSave={() => handleSaveProfile(user, isCurrentUser, isAuthenticated, updateUser)}
        onInputChange={handleInputChange}
        onFileSelect={handleFileSelect}
        onRemoveImage={handleRemoveImage}
        getProfileImageSrc={getProfileImageSrc}
        handleImageError={handleImageError}
      />

      <FollowModalComponent
        followModal={followModal}
        currentUserId={user?.id}
        onClose={closeFollowModal}
        onLoadMore={() => loadMoreUsers(user.id)}
        onToggleFollow={(targetUserId, currentlyFollowing) => 
          handleModalFollow(targetUserId, currentlyFollowing, updateUser)
        }
        getProfileImageSrc={getProfileImageSrc}
        handleImageError={handleImageError}
      />
    </div>
  );
};

export default UserProfile;