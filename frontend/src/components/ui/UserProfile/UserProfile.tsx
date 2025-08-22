/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopHeader from '../NavBar/NavBar';
import { UserService, type UserData, type UpdateUserRequest } from '../../../services/UserAPI/userService';
import { FollowService } from '../../../services/FollowAPI/followService';

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

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
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

  // Transform API UserData to component User interface
  const transformUserData = (apiData: UserData): User => ({
    id: apiData.id,
    email: '', // Not provided in current API response
    username: apiData.username,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    bio: apiData.bio || '',
    profilePicture: apiData.profileImagePath || '',
    role: 'USER', // Default role since not provided in API
    createdAt: apiData.createdAt,
    followersCount: apiData.followersCount,
    followingCount: apiData.followingCount,
    following: apiData.isFollowing
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let userData: UserData;
        
        if (username) {
          // Fetch specific user by username
          userData = await UserService.getUserById(username);
          setIsCurrentUser(false);
        } else {
          // Fetch current user
          userData = await UserService.getCurrentUser();
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
  }, [username]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* TopHeader */}
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
        {/* TopHeader */}
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
        {/* TopHeader */}
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
      {/* TopHeader */}
      <TopHeader 
        username={`${user.firstName} ${user.lastName}`} 
        userAvatar={user.profilePicture}
        userId={user.username}
      />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-6">
          <div className="px-6 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                />
              </div>
              
              {/* User Basic Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xl text-blue-100 mb-2">@{user.username}</p>
                {user.email && <p className="text-blue-200 mb-4">{user.email}</p>}
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <span className="font-medium">{user.role}</span>
                  </div>
                  {user.following && (
                    <div className="bg-green-500 bg-opacity-80 px-4 py-2 rounded-full">
                      <span className="font-medium">Following</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isCurrentUser ? (
                  <button 
                    onClick={handleEditProfile}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
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
                )}
                
                <Link
                  to={`/messages/${user.username}`}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center"
                >
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Link
            to={`/profile/${user.username}/followers`}
            className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow block"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{user.followersCount.toLocaleString()}</div>
            <div className="text-gray-600">Followers</div>
          </Link>
          
          <Link
            to={`/profile/${user.username}/following`}
            className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow block"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">{user.followingCount.toLocaleString()}</div>
            <div className="text-gray-600">Following</div>
          </Link>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockPosts.length}</div>
            <div className="text-gray-600">Posts</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-orange-600 mb-2">#{user.id.slice(-8)}</div>
            <div className="text-gray-600">User ID</div>
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
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Role</h4>
              <p className="text-gray-600">{user.role}</p>
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
              <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h4>
                      <span className="text-gray-500">@{user.username}</span>
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
            ))}
          </div>

          {/* Load More Button */}
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Load More Posts
            </button>
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
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form className="space-y-6">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  
                  {/* Avatar Preview */}
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="relative">
                      <img
                        src={previewUrl || '/default-avatar.png'}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-300 shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                      {imageUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex gap-3 mb-3">
                        {/* Upload File Button */}
                        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          📷 Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Upload a photo or enter an image URL below. Recommended: Square image, at least 400x400px, max 5MB.
                      </p>
                    </div>
                  </div>
                  
                  {/* Manual URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Or enter image URL:
                    </label>
                    <input
                      type="url"
                      name="profilePicture"
                      value={editForm.profilePicture}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {editForm.bio.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saveLoading || imageUploading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {saveLoading || imageUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {imageUploading ? 'Uploading Image...' : 'Saving...'}
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saveLoading || imageUploading}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;