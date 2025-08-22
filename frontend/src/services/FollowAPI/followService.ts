/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const JWT_TOKEN =import.meta.env.VITE_JWT_TOKEN;
// Create axios instance with dynamic auth token
const createApiClient = () => {
  const token = JWT_TOKEN;

  return axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// API Response wrapper interface
export interface ApiResponse<T> {
  status: string;
  message: string;
  success: boolean;
  data: T;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// User data for followers/following lists
export interface FollowUserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImagePath: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  size?: number;
}

// Follow service class
export class FollowService {
  
  /**
   * Follow a user
   * @param userId - ID of user to follow
   * @returns Promise<void>
   */
  static async followUser(userId: string): Promise<void> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.post<ApiResponse<void>>(`/api/users/${userId}/follow`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to follow user');
      }
      
    } catch (error) {
      console.error(`Error following user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   * @param userId - ID of user to unfollow
   * @returns Promise<void>
   */
  static async unfollowUser(userId: string): Promise<void> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.delete<ApiResponse<void>>(`/api/users/${userId}/follow`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to unfollow user');
      }
      
    } catch (error) {
      console.error(`Error unfollowing user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's followers
   * @param userId - ID of user to get followers for
   * @param params - Pagination parameters
   * @returns Promise<any> (changed to any to handle different response structures)
   */
  static async getUserFollowers(userId: string, params: PaginationParams = {}): Promise<any> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get(`/api/users/${userId}/followers`, {
        params: {
          page: params.page || 0,
          size: params.size || 20
        }
      });
      
      console.log('Raw followers API response:', response.data); // Debug log
      
      // Handle the new API response structure
      if (response.data && response.data.success) {
        // Return the entire response data for UserProfile to handle
        return {
          data: response.data.data,
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        };
      }
      
      // Fallback for old structure
      return response.data;
    } catch (error) {
      console.error(`Error fetching followers for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's following list
   * @param userId - ID of user to get following list for
   * @param params - Pagination parameters
   * @returns Promise<any> (changed to any to handle different response structures)
   */
  static async getUserFollowing(userId: string, params: PaginationParams = {}): Promise<any> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get(`/api/users/${userId}/following`, {
        params: {
          page: params.page || 0,
          size: params.size || 20
        }
      });
      
      console.log('Raw following API response:', response.data); // Debug log
      
      // Handle the new API response structure
      if (response.data && response.data.success) {
        // Return the entire response data for UserProfile to handle
        return {
          data: response.data.data,
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        };
      }
      
      // Fallback for old structure
      return response.data;
    } catch (error) {
      console.error(`Error fetching following list for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Toggle follow status for a user
   * @param userId - ID of user to toggle follow status
   * @param currentlyFollowing - Current follow status
   * @returns Promise<boolean> - New follow status
   */
  static async toggleFollow(userId: string, currentlyFollowing: boolean): Promise<boolean> {
    try {
      if (currentlyFollowing) {
        await this.unfollowUser(userId);
        return false;
      } else {
        await this.followUser(userId);
        return true;
      }
    } catch (error) {
      console.error(`Error toggling follow status for user ${userId}:`, error);
      throw error;
    }
  }
}

export default FollowService;