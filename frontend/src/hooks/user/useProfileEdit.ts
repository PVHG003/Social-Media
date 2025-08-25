/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../services/user/apiUser';

interface EditForm {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
}

interface UseProfileEditReturn {
  showEditModal: boolean;
  editForm: EditForm;
  saveLoading: boolean;
  imageUploading: boolean;
  selectedFile: File | null;
  previewUrl: string;
  setShowEditModal: (show: boolean) => void;
  initializeEditForm: (user: any) => void;
  handleEditProfile: (user: any, isCurrentUser: boolean) => void;
  handleCloseModal: (user: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleSaveProfile: (user: any, isCurrentUser: boolean, isAuthenticated: boolean, updateUser: (user: any) => void) => Promise<void>;
  handleChangePassword: () => void;
}

const CLOUDINARY = {
  UPLOAD_URL: import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
};

const FILE_UPLOAD = {
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_SIZE: 5 * 1024 * 1024 // 5MB
};

const transformUserData = (apiData: any) => ({
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

export const useProfileEdit = (): UseProfileEditReturn => {
  const navigate = useNavigate();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
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

  const initializeEditForm = useCallback((user: any) => {
    if (user) {
      setEditForm({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture
      });
      setPreviewUrl(user.profilePicture);
    }
  }, []);

  const handleEditProfile = useCallback((user: any, isCurrentUser: boolean) => {
    if (!isCurrentUser) return;
    setShowEditModal(true);
    setPreviewUrl(user?.profilePicture || '');
    setSelectedFile(null);
  }, []);

  const handleChangePassword = useCallback(() => {
    navigate('/change-password');
  }, [navigate]);

  const handleCloseModal = useCallback((user: any) => {
    setShowEditModal(false);
    setSelectedFile(null);
    setPreviewUrl(user?.profilePicture || '');
    if (user) {
      setEditForm({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicture: user.profilePicture
      });
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'profilePicture') {
      setPreviewUrl(value);
      setSelectedFile(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setPreviewUrl('');
    setSelectedFile(null);
    setEditForm(prev => ({ ...prev, profilePicture: '' }));
  }, []);

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

  const handleSaveProfile = useCallback(async (
    user: any, 
    isCurrentUser: boolean, 
    isAuthenticated: boolean, 
    updateUser: (user: any) => void
  ) => {
    if (!user || !isCurrentUser || !isAuthenticated) return;
    
    setSaveLoading(true);
    try {
      let profilePictureUrl = editForm.profilePicture;
      
      if (selectedFile) {
        setImageUploading(true);
        try {
          profilePictureUrl = await uploadToCloudinary(selectedFile);
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
      
      const updatedUser = transformUserData(updatedUserData);
      updateUser(updatedUser);
      setShowEditModal(false);
      setSelectedFile(null);
      
    } catch (err: any) {
      console.error('Save error:', err);
      
      if (err.message?.includes('401')) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } finally {
      setSaveLoading(false);
    }
  }, [editForm, selectedFile, navigate]);

  return {
    showEditModal,
    editForm,
    saveLoading,
    imageUploading,
    selectedFile,
    previewUrl,
    setShowEditModal,
    initializeEditForm,
    handleEditProfile,
    handleCloseModal,
    handleInputChange,
    handleFileSelect,
    handleRemoveImage,
    handleSaveProfile,
    handleChangePassword
  };
};