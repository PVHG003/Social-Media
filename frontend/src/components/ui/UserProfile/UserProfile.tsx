/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopHeader from '../NavBar/NavBar';

interface User {
  id: number;
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

const CLOUDINARY_CLOUD_NAME = 'dyaybnveq'; 
const CLOUDINARY_UPLOAD_PRESET = 'social_media_preset';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profilePicture: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        
        const url = username 
          ? `http://localhost:8080/api/users/${username}`
          : 'http://localhost:8080/api/users/me';
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        setUser(userData);
        setUser(userData);
        setEditForm({
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: userData.bio,
          profilePicture: userData.profilePicture
        });
        setPreviewUrl(userData.profilePicture);
        
    
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'social_media/profiles'); 
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data locally (in real app, this would be an API call)
      const updatedUser = {
        ...user,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        bio: editForm.bio,
        profilePicture: profilePictureUrl
      };
      
      setUser(updatedUser);
      setShowEditModal(false);
      setSelectedFile(null);
      
      // In real app, make API call here:
      /*
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          bio: editForm.bio,
          profilePicture: profilePictureUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      */
      
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader username={username || 'user1'} />
        <div className="flex items-center justify-center pt-8">
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
        <TopHeader username={username || 'user1'} />
        <div className="flex items-center justify-center pt-8">
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
        <TopHeader username={username || 'user1'} />
        <div className="flex items-center justify-center pt-8">
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
      {/* Navigation Bar */}
      <TopHeader 
        username={user.firstName + ' ' + user.lastName} 
        userAvatar={user.profilePicture}
        userId={user.username}
      />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-4">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            
            {/* User Basic Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-xl text-blue-100 mb-2">@{user.username}</p>
              <p className="text-blue-200 mb-4">{user.email}</p>
              
              <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <span className="font-medium">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">{user.followersCount.toLocaleString()}</div>
            <div className="text-gray-600">Followers</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-2">{user.followingCount.toLocaleString()}</div>
            <div className="text-gray-600">Following</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">#{user.id}</div>
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
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleEditProfile}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105"
          >
            Edit Profile
          </button>
          
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105">
            Settings
          </button>
          
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105">
            Contact
          </button>
        </div>
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