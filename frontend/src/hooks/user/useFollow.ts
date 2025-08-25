/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useAuth } from '../../context/authentication/AuthContext';
import followApi from '../../services/follow/apiFollow';
import userApi from '../../services/user/apiUser';

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

interface UseFollowReturn {
  followLoading: boolean;
  followModal: FollowModal;
  handleFollowToggle: (user: any, isCurrentUser: boolean, updateUser: (updater: (prev: any) => any) => void) => Promise<void>;
  openFollowModal: (type: 'followers' | 'following', userId: string) => Promise<void>;
  closeFollowModal: () => void;
  loadMoreUsers: (userId: string) => Promise<void>;
  handleModalFollow: (targetUserId: string, currentlyFollowing: boolean, updateMainUser?: (updater: (prev: any) => any) => void) => Promise<void>;
}

const transformToFollowUser = (apiData: any): FollowUser => ({
  id: apiData.id,
  username: apiData.username,
  firstName: apiData.firstName,
  lastName: apiData.lastName,
  bio: apiData.bio || null,
  profileImagePath: apiData.profileImagePath || null,
  isFollowing: apiData.isFollowing || false
});

export const useFollow = (): UseFollowReturn => {
  const authContext = useAuth();
  
  const [followLoading, setFollowLoading] = useState(false);
  const [followModal, setFollowModal] = useState<FollowModal>({
    isOpen: false,
    type: null,
    users: [],
    loading: false,
    hasMore: false,
    page: 0
  });

  const isAuthenticated = !!authContext?.token;

  const handleFollowToggle = useCallback(async (
    user: any, 
    isCurrentUser: boolean, 
    updateUser: (updater: (prev: any) => any) => void
  ) => {
    if (!user || isCurrentUser || !isAuthenticated) return;
    
    setFollowLoading(true);
    try {
      const newFollowStatus = await followApi.toggleFollow(user.id, user.following);
      
      updateUser((prev: any) => prev ? {
        ...prev,
        following: newFollowStatus,
        followersCount: newFollowStatus 
          ? prev.followersCount + 1 
          : prev.followersCount - 1
      } : null);
      
    } catch (err: any) {
      console.error('Error toggling follow:', err);
      alert('Failed to update follow status: ' + (err.message || 'Unknown error'));
    } finally {
      setFollowLoading(false);
    }
  }, [isAuthenticated]);

  const openFollowModal = useCallback(async (type: 'followers' | 'following', userId: string) => {
    if (!isAuthenticated) return;
    
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
        response = await userApi.getFollowers(userId, { page: 0, size: 20 });
      } else {
        response = await userApi.getFollowing(userId, { page: 0, size: 20 });
      }

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
  }, [isAuthenticated]);

  const closeFollowModal = useCallback(() => {
    setFollowModal({
      isOpen: false,
      type: null,
      users: [],
      loading: false,
      hasMore: false,
      page: 0
    });
  }, []);

  const loadMoreUsers = useCallback(async (userId: string) => {
    if (!followModal.type || followModal.loading || !followModal.hasMore || !isAuthenticated) return;

    setFollowModal(prev => ({ ...prev, loading: true }));

    try {
      const nextPage = followModal.page + 1;
      let response;
      
      if (followModal.type === 'followers') {
        response = await userApi.getFollowers(userId, { page: nextPage, size: 20 });
      } else {
        response = await userApi.getFollowing(userId, { page: nextPage, size: 20 });
      }

      let newUsers: FollowUser[] = [];
      let hasMore = false;

      if (response && response.data && Array.isArray(response.data)) {
        newUsers = response.data.map(transformToFollowUser);
        hasMore = (response.page !== undefined && response.totalPages !== undefined) ? response.page < response.totalPages - 1 : false;
      } else if (Array.isArray(response)) {
        newUsers = response.map(transformToFollowUser);
        hasMore = false;
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
  }, [followModal.type, followModal.loading, followModal.hasMore, followModal.page, isAuthenticated]);

  const handleModalFollow = useCallback(async (
    targetUserId: string, 
    currentlyFollowing: boolean,
    updateMainUser?: (updater: (prev: any) => any) => void
  ) => {
    if (!isAuthenticated) return;
    
    try {
      const newStatus = await followApi.toggleFollow(targetUserId, currentlyFollowing);
      
      setFollowModal(prev => ({
        ...prev,
        users: prev.users.map(u => 
          u.id === targetUserId 
            ? { ...u, isFollowing: newStatus }
            : u
        )
      }));

      if (updateMainUser && followModal.type === 'following') {
        updateMainUser((prev: any) => prev ? {
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
  }, [isAuthenticated, followModal.type]);

  return {
    followLoading,
    followModal,
    handleFollowToggle,
    openFollowModal,
    closeFollowModal,
    loadMoreUsers,
    handleModalFollow
  };
};