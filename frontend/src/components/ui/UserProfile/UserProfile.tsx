// filepath: d:\Training_VTI\Final_Project\Social-Media\frontend\src\components\ui\UserProfile\UserProfile.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopHeader from '../NavBar/NavBar';
import { UserService, type UserData, type UpdateUserRequest } from '../../../services/UserAPI/userService';
import { FollowService } from '../../../services/FollowAPI/followService';
import EditProfileModal from './EditProfileModal';
import FollowModalComponent from './FollowModal';
import PostCard from './PostCard';

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

// Mock post interface for demonstration
interface MockPost {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

// Follow user interface for modal - simplified version
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
  
  // New state for follow modal with correct type
  const [followModal, setFollowModal] = useState<FollowModal>({
    isOpen: false,
    type: null,
    users: [],
    loading: false,
    hasMore: false,
    page: 0
  });
  
  // Mock posts data - sẽ thay bằng API call thực
  const [mockPosts] = useState<MockPost[]>([
    {
      id: '1',
      content: 'Just had an amazing day at the beach! 🏖️ The weather was perfect and the sunset was breathtaking. There\'s nothing like the sound of waves to clear your mind.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      createdAt: '2024-01-15T10:30:00Z',
      likesCount: 24,
      commentsCount: 8,
      isLiked: false
    },
    {
      id: '2',
      content: 'Working on some exciting new projects! Can\'t wait to share what I\'ve been building. The tech stack includes React, TypeScript, and Spring Boot. #coding #developer',
      createdAt: '2024-01-14T14:20:00Z',
      likesCount: 42,
      commentsCount: 12,
      isLiked: true
    },
    {
      id: '3',
      content: 'Coffee and code - the perfect combination for a productive morning ☕',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
      createdAt: '2024-01-13T08:15:00Z',
      likesCount: 18,
      commentsCount: 5,
      isLiked: false
    },
    {
      id: '4',
      content: 'Exploring the local farmers market today. Found some amazing organic vegetables and met some wonderful local vendors. Supporting local business feels great! 🥕🥬',
      createdAt: '2024-01-12T16:45:00Z',
      likesCount: 31,
      commentsCount: 7,
      isLiked: true
    },
    {
      id: '5',
      content: 'Just finished reading an incredible book on software architecture. The insights on microservices and system design were mind-blowing. Highly recommend it to fellow developers!',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop',
      createdAt: '2024-01-11T20:10:00Z',
      likesCount: 67,
      commentsCount: 15,
      isLiked: false
    }
  ]);

  // Safe function to get profile image with fallback
  const getProfileImageSrc = (profileImagePath?: string | null): string => {
    if (!profileImagePath || profileImagePath.trim() === '') {
      return '/default-avatar.png';
    }
    return profileImagePath;
  };

  // Transform API UserData to component User interface
  const transformUserData = (apiData: UserData): User => ({
    id: apiData.id,
    email: '', // Not provided in current API response
    username: apiData.username,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    bio: apiData.bio || '',
    profilePicture: apiData.profileImagePath || '', // Safe fallback to empty string
    role: 'USER', // Default role since not provided in API
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
        response = await FollowService.getUserFollowers(user.id, { page: 0, size: 20 });
      } else {
        response = await FollowService.getUserFollowing(user.id, { page: 0, size: 20 });
      }

      console.log('API Response:', response); // Debug log

      // Handle the new API response structure
      let transformedUsers: FollowUser[] = [];
      let hasMore = false;
      let currentPage = 0;

      if (response && response.data && Array.isArray(response.data)) {
        // New API structure: response.data contains the array
        transformedUsers = response.data.map(transformToFollowUser);
        hasMore = response.page < response.totalPages - 1;
        currentPage = response.page || 0;
      } else if (response && response.content && Array.isArray(response.content)) {
        // Old structure fallback
        transformedUsers = response.content.map(transformToFollowUser);
        hasMore = response.number < response.totalPages - 1;
        currentPage = response.number || 0;
      } else if (Array.isArray(response)) {
        // Direct array response
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
        users: [], // Ensure users is empty array on error
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
        response = await FollowService.getUserFollowers(user.id, { page: nextPage, size: 20 });
      } else {
        response = await FollowService.getUserFollowing(user.id, { page: nextPage, size: 20 });
      }

      console.log('Load More API Response:', response); // Debug log

      // Handle the new API response structure
      let newUsers: FollowUser[] = [];
      let hasMore = false;

      if (response && response.data && Array.isArray(response.data)) {
        // New API structure: response.data contains the array
        newUsers = response.data.map(transformToFollowUser);
        hasMore = response.page < response.totalPages - 1;
      } else if (response && response.content && Array.isArray(response.content)) {
        // Old structure fallback
        newUsers = response.content.map(transformToFollowUser);
        hasMore = response.number < response.totalPages - 1;
      } else if (Array.isArray(response)) {
        // Direct array response
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
      const newStatus = await FollowService.toggleFollow(targetUserId, currentlyFollowing);
      
      // Update the user in modal list
      setFollowModal(prev => ({
        ...prev,
        users: prev.users.map(u => 
          u.id === targetUserId 
            ? { ...u, isFollowing: newStatus }
            : u
        )
      }));

      // Update main user counts if needed
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
        
        let userData: UserData;
        
        if (username || userId) {
          // Fetch specific user by username or userId
          const identifier = username || userId;
          userData = await UserService.getUserById(identifier!);
          setIsCurrentUser(false);
        } else {
          // Fetch current user
          userData = await UserService.getCurrentUser();
          setIsCurrentUser(true);
        }
        
        const transformedUser = transformUserData(userData);
        setUser(transformedUser);
        
        // Initialize edit form with safe values
        setEditForm({
          username: transformedUser.username,
          firstName: transformedUser.firstName,
          lastName: transformedUser.lastName,
          bio: transformedUser.bio,
          profilePicture: transformedUser.profilePicture
        });
        setPreviewUrl(transformedUser.profilePicture);
        
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        
        if (err.response?.status === 404) {
          setError('User not found');
        } else if (err.response?.status === 401) {
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
      const newFollowStatus = await FollowService.toggleFollow(user.id, user.following);
      
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
    
    // If user types in URL field, update preview
    if (name === 'profilePicture') {
      setPreviewUrl(value);
      setSelectedFile(null); // Clear selected file if user enters URL
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setSelectedFile(null);
    setEditForm(prev => ({ ...prev, profilePicture: '' }));
  };

  // Safe image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/default-avatar.png';
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes}m ago`;
      }
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
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
      
      // If user selected a new file, upload to Cloudinary first
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
      
      // Update profile via UserService
      const updatePayload: UpdateUserRequest = {
        username: editForm.username,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        bio: editForm.bio || null,
        profileImagePath: profilePictureUrl || null
      };
      
      const updatedUserData = await UserService.updateCurrentUser(updatePayload);
      
      // Update local state with new data
      const updatedUser = transformUserData(updatedUserData);
      setUser(updatedUser);
      setShowEditModal(false);
      setSelectedFile(null);
      
    } catch (err: any) {
      console.error('Save error:', err);
      
      if (err.response?.status === 401) {
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
          username={username || 'Loading...'} 
          userAvatar=""
          userId={username || ''}
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
          username={username || 'Error'} 
          userAvatar=""
          userId={username || ''}
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
          username="Profile Not Found" 
          userAvatar=""
          userId=""
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
        username={`${user.firstName} ${user.lastName}`} 
        userAvatar={getProfileImageSrc(user.profilePicture)}
        userId={user.username}
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
                      to={`/messages/${user.username}`}
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
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">{mockPosts.length}</div>
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

        {/* User Posts Section */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {isCurrentUser ? 'My Posts' : `${user.firstName}'s Posts`}
            </h3>
            <p className="text-gray-600 mt-1">{mockPosts.length} posts</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                getProfileImageSrc={getProfileImageSrc}
                handleImageError={handleImageError}
                formatTimeAgo={formatTimeAgo}
              />
            ))}

            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Load More Posts
              </button>
            </div>
          </div>
        </div>

        {/* Additional Actions for Current User */}
        {isCurrentUser && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/settings"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Account Settings
            </Link>
            
            <Link
              to="/privacy"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Privacy Settings
            </Link>
          </div>
        )}
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