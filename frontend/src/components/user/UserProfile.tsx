/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopHeader from '../ui/NavBar/NavBar';
import userApi from '../../services/user/apiUser';
import followApi from '../../services/follow/apiFollow';
import postApi from '../../services/post/apiPost';
import EditProfileModal from './EditProfileModal';
import FollowModalComponent from './FollowModal';
import PostCard from '../post/PostCard';
import type { Post } from '@/types/post';

const CLOUDINARY = {
  UPLOAD_URL: import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
};

const FILE_UPLOAD = {
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_SIZE: 5 * 1024 * 1024 // 5MB
};

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

// Follow user interface for modal
interface FollowUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  profileImagePath?: string | null;
  isFollowing: boolean;
}

// Modal interface with correct type
interface FollowModal {
  isOpen: boolean;
  type: 'followers' | 'following' | null;
  users: FollowUser[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}

const UserProfile = () => {
  const { username, userId } = useParams<{ username?: string; userId?: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    profilePicture: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [followLoading, setFollowLoading] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  // Posts state - Updated to match HomePage
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // New state for follow modal with correct type
  const [followModal, setFollowModal] = useState<FollowModal>({
    isOpen: false,
    type: null,
    users: [],
    loading: false,
    hasMore: false,
    page: 0
  });

  // Safe function to get profile image with fallback - Updated to match HomePage
  const getProfileImageSrc = (profileImagePath?: string | null): string => {
    if (!profileImagePath || profileImagePath.trim() === '') {
      return '/default-avatar.png';
    }
    return profileImagePath.startsWith('http') ? profileImagePath : `http://localhost:8080${profileImagePath}`;
  };

  // Transform API UserData to component User interface
  const transformUserData = (apiData: any): User => ({
    id: apiData.id,
    email: apiData.email || '',
    username: apiData.username,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    bio: apiData.bio || '',
    profilePicture: apiData.profileImagePath || '', 
    role: apiData.role || 'USER',
    createdAt: apiData.createdAt,
    followersCount: apiData.followersCount || 0,
    followingCount: apiData.followingCount || 0,
    following: apiData.isFollowing || false
  });

  // Transform API response to FollowUser interface
  const transformToFollowUser = (apiData: any): FollowUser => ({
    id: apiData.id,
    username: apiData.username,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    bio: apiData.bio || null,
    profileImagePath: apiData.profileImagePath || null,
    isFollowing: apiData.isFollowing || false
  });

  // Fetch user posts - Updated to match HomePage pattern
  const fetchUserPosts = async (targetUserId: string, pageNum: number = 0, append: boolean = false) => {
    try {
      if (!append) setPostsLoading(true);
      else setLoadingMore(true);
      setPostsError(null);

      const response = await postApi.getPostsByUser(targetUserId, pageNum, 10);
      
      if (response.success && response.data) {
        const validPosts = (response.data || []).filter(post => post.id) as Post[];
        
        if (append) {
          setPosts(prev => [...prev, ...validPosts]);
        } else {
          setPosts(validPosts);
        }
        
        // Check if there are more posts
        setHasMore(pageNum < (response.totalPages || 1) - 1);
        setPage(pageNum);
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (error: any) {
      console.error('Error fetching user posts:', error);
      setPostsError(error.message || 'Failed to load posts');
      if (!append) {
        setPosts([]);
      }
    } finally {
      setPostsLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more posts - Updated to match HomePage
  const handleLoadMore = () => {
    if (!user || loadingMore || !hasMore) return;
    
    fetchUserPosts(user.id, page + 1, true);
  };

  // Handle post like - Updated to match HomePage pattern
  const handleLike = async (postId: string, isCurrentlyLiked: boolean) => {
    try {
      let response;
      if (isCurrentlyLiked) {
        response = await postApi.unlikePost(postId);
      } else {
        response = await postApi.likePost(postId);
      }
      
      // Update posts list với data từ server
      if (response.data && response.data.id) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? response.data as Post : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error; // Re-throw để PostCard có thể handle
    }
  };

  // Handle post deletion - Updated naming to match HomePage
  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  // Handle post update - Updated naming to match HomePage
  const handleUpdatePost = (postId: string, updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? updatedPost : post
    ));
  };

  // Open followers/following modal
  const openFollowModal = async (type: 'followers' | 'following') => {
    if (!user) return;
    
    setFollowModal({
      isOpen: true,
      type,
      users: [],
      loading: true,
      hasMore: false,
      page: 0
    });

    try {
      let response;
      if (type === 'followers') {
        response = await userApi.getFollowers(user.id, { page: 0, size: 20 });
      } else {
        response = await userApi.getFollowing(user.id, { page: 0, size: 20 });
      }

      // Handle the API response structure
      let transformedUsers: FollowUser[] = [];
      let hasMore = false;
      let currentPage = 0;

      if (response && response.data && Array.isArray(response.data)) {
        transformedUsers = response.data.map(transformToFollowUser);
        hasMore = (response.page !== undefined && response.totalPages !== undefined) ? response.page < response.totalPages - 1 : false;
        currentPage = response.page || 0;
      } else if (Array.isArray(response)) {
        transformedUsers = response.map(transformToFollowUser);
        hasMore = false;
        currentPage = 0;
      } else {
        console.warn('Unexpected response structure:', response);
        transformedUsers = [];
      }

      setFollowModal(prev => ({
        ...prev,
        users: transformedUsers,
        loading: false,
        hasMore: hasMore,
        page: currentPage
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setFollowModal(prev => ({
        ...prev,
        loading: false,
        users: [],
      }));
    }
  };

  // Load more users in modal
  const loadMoreUsers = async () => {
    if (!user || !followModal.type || followModal.loading || !followModal.hasMore) return;

    setFollowModal(prev => ({ ...prev, loading: true }));

    try {
      const nextPage = followModal.page + 1;
      let response;
      
      if (followModal.type === 'followers') {
        response = await userApi.getFollowers(user.id, { page: nextPage, size: 20 });
      } else {
        response = await userApi.getFollowing(user.id, { page: nextPage, size: 20 });
      }

      let newUsers: FollowUser[] = [];
      let hasMore = false;

      if (response && response.data && Array.isArray(response.data)) {
        newUsers = response.data.map(transformToFollowUser);
        hasMore = (response.page !== undefined && response.totalPages !== undefined) ? response.page < response.totalPages - 1 : false;
      } else if (Array.isArray(response)) {
        newUsers = response.map(transformToFollowUser);
        hasMore = false;
      } else {
        console.warn('Unexpected load more response structure:', response);
        newUsers = [];
      }

      setFollowModal(prev => ({
        ...prev,
        users: [...prev.users, ...newUsers],
        loading: false,
        hasMore: hasMore,
        page: nextPage
      }));
    } catch (error) {
      console.error('Error loading more users:', error);
      setFollowModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Close modal
  const closeFollowModal = () => {
    setFollowModal({
      isOpen: false,
      type: null,
      users: [],
      loading: false,
      hasMore: false,
      page: 0
    });
  };

  // Handle follow/unfollow in modal
  const handleModalFollow = async (targetUserId: string, currentlyFollowing: boolean) => {
    try {
      const newStatus = await followApi.toggleFollow(targetUserId, currentlyFollowing);
      
      // Update the user in modal list
      setFollowModal(prev => ({
        ...prev,
        users: prev.users.map(u => 
          u.id === targetUserId 
            ? { ...u, isFollowing: newStatus }
            : u
        )
      }));

      // Update main user counts
      if (user && followModal.type === 'following') {
        setUser(prev => prev ? {
          ...prev,
          followingCount: newStatus 
            ? prev.followingCount + 1 
            : prev.followingCount - 1
        } : null);
      }
    } catch (error) {
      console.error('Error toggling follow in modal:', error);
      alert('Failed to update follow status');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let userData: any;
        
        if (userId) {
          // Fetch specific user by userId
          const identifier = userId;
          const response = await userApi.getUserById(identifier!);
          userData = response.data;
          setIsCurrentUser(false);
        } else {
          // Fetch current user
          const response = await userApi.getCurrentUser();
          userData = response.data;
          setIsCurrentUser(true);
        }
        
        const transformedUser = transformUserData(userData);
        setUser(transformedUser);
        
        // Initialize edit form
        setEditForm({
          username: transformedUser.username,
          firstName: transformedUser.firstName,
          lastName: transformedUser.lastName,
          bio: transformedUser.bio,
          profilePicture: transformedUser.profilePicture
        });
        setPreviewUrl(transformedUser.profilePicture);
        
        // Fetch user posts - Updated to use new pattern
        await fetchUserPosts(transformedUser.id, 0, false);
        
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        
        if (err.message?.includes('404')) {
          setError('User not found');
        } else if (err.message?.includes('401')) {
          setError('Unauthorized - Please login again');
        } else {
          setError(err.message || 'Failed to fetch user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, userId]);

  const handleFollowToggle = async () => {
    if (!user || isCurrentUser) return;
    
    setFollowLoading(true);
    try {
      const newFollowStatus = await followApi.toggleFollow(user.id, user.following);
      
      setUser(prev => prev ? {
        ...prev,
        following: newFollowStatus,
        followersCount: newFollowStatus 
          ? prev.followersCount + 1 
          : prev.followersCount - 1
      } : null);
      
    } catch (err: any) {
      console.error('Error toggling follow:', err);
      alert('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    setPreviewUrl(user?.profilePicture || '');
    setSelectedFile(null);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedFile(null);
    setPreviewUrl(user?.profilePicture || '');
    // Reset form to current user data
    if (user) {
      setEditForm({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'profilePicture') {
      setPreviewUrl(value);
      setSelectedFile(null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setSelectedFile(null);
    setEditForm(prev => ({ ...prev, profilePicture: '' }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/default-avatar.png';
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY.UPLOAD_PRESET || !CLOUDINARY.UPLOAD_URL) {
      throw new Error('Cloudinary configuration is missing');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY.UPLOAD_PRESET);
    formData.append('folder', 'social_media/profiles');
    
    const response = await fetch(CLOUDINARY.UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      let profilePictureUrl = editForm.profilePicture;
      
      //Upload Cloundinary
      if (selectedFile) {
        setImageUploading(true);
        try {
          profilePictureUrl = await uploadToCloudinary(selectedFile);
          console.log('Image uploaded to Cloudinary:', profilePictureUrl);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        } finally {
          setImageUploading(false);
        }
      }
      

      const updatePayload = {
        username: editForm.username || "",
        firstName: editForm.firstName || "",
        lastName: editForm.lastName || "",
        bio: editForm.bio || "",
        profileImagePath: profilePictureUrl || ""
      };
      
      const response = await userApi.updateCurrentUser(updatePayload);
      const updatedUserData = response.data;
      
      // Update local state with new data
      const updatedUser = transformUserData(updatedUserData);
      setUser(updatedUser);
      setShowEditModal(false);
      setSelectedFile(null);
      
    } catch (err: any) {
      console.error('Save error:', err);
      
      if (err.message?.includes('401')) {
        alert('Session expired. Please login again.');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader
          fullName="Loading..."
          username=""
          userAvatar=""
          userId= ""
          isAuthenticated={true}
        />
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader
          fullName="Error"
          username=""
          userAvatar=""
          userId={username || ''}
          isAuthenticated={true}
        />
        
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
        <TopHeader
          fullName="Profile Not Found"
          username=""
          userAvatar=""
          userId=""
          isAuthenticated={true}
        />
        
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
      <TopHeader
        fullName={`${user.firstName} ${user.lastName}`} 
        username={user.username} 
        userAvatar={getProfileImageSrc(user.profilePicture)}
        userId={user.id}
        isAuthenticated={true}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-6">
          <div className="px-6 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src={getProfileImageSrc(user.profilePicture)}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
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
                  {user.following && (
                    <div className="bg-green-500 bg-opacity-80 px-4 py-2 rounded-full">
                      <span className="font-medium">Following</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {isCurrentUser ? (
                  <button 
                    onClick={handleEditProfile}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        user.following
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-white text-blue-600 hover:bg-gray-100'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? 'Loading...' : (user.following ? 'Unfollow' : 'Follow')}
                    </button>
                    
                    <Link
                      to={`/chat/${user.id}`}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center"
                    >
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
            onClick={() => openFollowModal('followers')}
            className="bg-white rounded-lg p-4 md:p-6 shadow-md text-center hover:shadow-lg transition-shadow block w-full"
          >
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{user.followersCount.toLocaleString()}</div>
            <div className="text-sm md:text-base text-gray-600">Followers</div>
          </button>
          
          <button
            onClick={() => openFollowModal('following')}
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
                <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
                <p className="text-gray-600">{user.email}</p>
              </div>
            )}
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Username</h4>
              <p className="text-gray-600">@{user.username}</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Member Since</h4>
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

        {/* User Posts Section - Updated to match HomePage style */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isCurrentUser ? 'My Posts' : `${user.firstName}'s Posts`}
            </h3>
            <p className="text-gray-600 text-lg">{posts.length} posts</p>
          </div>
          
          {/* Posts Loading State - Updated styling */}
          {postsLoading && posts.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading posts...</p>
              </div>
            </div>
          )}

          {/* Posts Error State - Updated styling */}
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

          {/* Posts List - Updated to match HomePage */}
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

              {/* Load More Button - Updated to match HomePage */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loadingMore ? (
                      <span className="flex items-center space-x-2">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

          {/* No Posts State - Updated to match HomePage */}
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal && isCurrentUser}
        user={user}
        editForm={editForm}
        previewUrl={previewUrl}
        selectedFile={selectedFile}
        saveLoading={saveLoading}
        imageUploading={imageUploading}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
        onInputChange={handleInputChange}
        onFileSelect={handleFileSelect}
        onRemoveImage={handleRemoveImage}
        getProfileImageSrc={getProfileImageSrc}
        handleImageError={handleImageError}
      />

      {/* Follow Modal */}
      <FollowModalComponent
        followModal={followModal}
        currentUserId={user?.id}
        onClose={closeFollowModal}
        onLoadMore={loadMoreUsers}
        onToggleFollow={handleModalFollow}
        getProfileImageSrc={getProfileImageSrc}
        handleImageError={handleImageError}
      />
    </div>
  );
};

export default UserProfile;