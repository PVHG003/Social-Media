/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authentication/AuthContext';
import userApi from '../../services/user/apiUser';

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

interface UseUserProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isCurrentUser: boolean;
  currentUserId: string | null;
  refetchUser: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

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

export const useUserProfile = (userId?: string): UseUserProfileReturn => {
  const navigate = useNavigate();
  const authContext = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isAuthenticated = !!authContext?.token;

  // Get current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      if (authContext?.user?.userId) {
        return authContext.user.userId;
      }
      
      const response = await userApi.getCurrentUser();
      return response?.data?.id || null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  };

  // Initialize current user ID
  useEffect(() => {
    const initCurrentUserId = async () => {
      if (isAuthenticated) {
        const id = await getCurrentUserId();
        setCurrentUserId(id);
      }
    };

    initCurrentUserId();
  }, [isAuthenticated, authContext?.user]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let userData: any;
      let profileUserId: string;
      
      if (userId) {
        const response = await userApi.getUserById(userId);
        userData = response.data;
        profileUserId = userData.id;
      } else {
        if (authContext?.user) {
          userData = authContext.user;
          profileUserId = userData.id;
        } else {
          const response = await userApi.getCurrentUser();
          userData = response.data;
          profileUserId = userData.id;
        }
      }
      
      // Ensure we have current user ID
      let actualCurrentUserId = currentUserId;
      if (!actualCurrentUserId) {
        actualCurrentUserId = await getCurrentUserId();
        setCurrentUserId(actualCurrentUserId);
      }
      
      // Compare user IDs to determine if this is current user's profile
      const isOwner = actualCurrentUserId === profileUserId;
      setIsCurrentUser(isOwner);
      
      const transformedUser = transformUserData(userData);
      setUser(transformedUser);
      
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      
      if (err.message?.includes('404')) {
        setError('User not found');
      } else if (err.message?.includes('401')) {
        setError('Unauthorized - Please login again');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.message || 'Failed to fetch user profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId !== null || !userId) {
      fetchUserProfile();
    }
  }, [userId, isAuthenticated, authContext?.user, currentUserId]);

  const refetchUser = async () => {
    await fetchUserProfile();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    error,
    isCurrentUser,
    currentUserId,
    refetchUser,
    updateUser
  };
};