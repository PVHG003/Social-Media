import axios from 'axios';

// Environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';  
const JWT_TOKEN = import.meta.env.VITE_JWT_TOKEN;

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

// Paginated response interface for new API structure
export interface SearchResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// User data from API
export interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profileImagePath: string | null;
  coverImagePath: string | null;
  createdAt: string;
  updatedAt: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

// Update user request interface
export interface UpdateUserRequest {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImagePath: string | null;
}

// Search parameters
export interface SearchParams {
  q: string;
  page?: number;
  size?: number;
}

// User service class
export class UserService {
  
  /**
   * Get current user profile
   * @returns Promise<UserData>
   */
  static async getCurrentUser(): Promise<UserData> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get<ApiResponse<UserData>>('/api/users/me');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch current user');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  /**
   * Get user by userId
   * @param userId - User ID to fetch
   * @returns Promise<UserData>
   */
  static async getUserById(userId: string): Promise<UserData> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get<ApiResponse<UserData>>(`/api/users/${userId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || `Failed to fetch user ${userId}`);
      }
      
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update current user profile
   * @param userData - User data to update
   * @returns Promise<UserData>
   */
  static async updateCurrentUser(userData: UpdateUserRequest): Promise<UserData> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.put<ApiResponse<UserData>>('/api/users/me', userData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update user profile');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Search users by query - Updated for new API structure
   * @param params - Search parameters
   * @returns Promise<SearchResponse<UserData>>
   */
  static async searchUsers(params: SearchParams): Promise<SearchResponse<UserData>> {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get<ApiResponse<UserData[]> & SearchResponse<UserData>>('/api/users/search', {
        params: {
          q: params.q,
          page: params.page || 0,
          size: params.size || 10
        }
      });
      
      console.log('Search API Response:', response.data); // Debug log
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search users');
      }
      
      // Handle the new API response structure
      return {
        data: response.data.data || [],
        page: response.data.page || 0,
        pageSize: response.data.pageSize || 10,
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default UserService;