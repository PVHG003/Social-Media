/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useAuth } from '../../context/authentication/AuthContext';
import postApi from '../../services/post/apiPost';
import type { Post } from '@/types/post';

interface UseUserPostsReturn {
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  page: number;
  hasMore: boolean;
  loadingMore: boolean;
  fetchUserPosts: (targetUserId: string, pageNum?: number, append?: boolean) => Promise<void>;
  handleLoadMore: (userId: string) => void;
  handleLike: (postId: string, isCurrentlyLiked: boolean) => Promise<void>;
  handleDeletePost: (postId: string) => void;
  handleUpdatePost: (postId: string, updatedPost: Post) => void;
}

export const useUserPosts = (): UseUserPostsReturn => {
  const authContext = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isAuthenticated = !!authContext?.token;

  const fetchUserPosts = useCallback(async (targetUserId: string, pageNum: number = 0, append: boolean = false) => {
    if (!isAuthenticated) return;
    
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
  }, [isAuthenticated]);

  const handleLoadMore = useCallback((userId: string) => {
    if (loadingMore || !hasMore || !isAuthenticated) return;
    fetchUserPosts(userId, page + 1, true);
  }, [fetchUserPosts, loadingMore, hasMore, page, isAuthenticated]);

  const handleLike = useCallback(async (postId: string, isCurrentlyLiked: boolean) => {
    if (!isAuthenticated) return;
    
    try {
      let response;
      if (isCurrentlyLiked) {
        response = await postApi.unlikePost(postId);
      } else {
        response = await postApi.likePost(postId);
      }
      
      if (response.data && response.data.id) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? response.data as Post : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const handleUpdatePost = useCallback((postId: string, updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? updatedPost : post
    ));
  }, []);

  return {
    posts,
    postsLoading,
    postsError,
    page,
    hasMore,
    loadingMore,
    fetchUserPosts,
    handleLoadMore,
    handleLike,
    handleDeletePost,
    handleUpdatePost
  };
};