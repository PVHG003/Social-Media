/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

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

interface EditForm {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  user: User | null;
  editForm: EditForm;
  previewUrl: string;
  selectedFile: File | null;
  saveLoading: boolean;
  imageUploading: boolean;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  getProfileImageSrc: (path?: string | null) => string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  user,
  editForm,
  previewUrl,
  selectedFile,
  saveLoading,
  imageUploading,
  onClose,
  onSave,
  onInputChange,
  onFileSelect,
  onRemoveImage,
  getProfileImageSrc,
  handleImageError
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
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
                    src={getProfileImageSrc(previewUrl)}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-300 shadow-md"
                    onError={handleImageError}
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
                        onChange={onFileSelect}
                        className="hidden"
                      />
                    </label>
                    
                    {/* Remove Image Button */}
                    <button
                      type="button"
                      onClick={onRemoveImage}
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
                  onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onClick={onSave}
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
                onClick={onClose}
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
  );
};

export default EditProfileModal;