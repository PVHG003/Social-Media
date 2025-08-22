import {
  UserControllerApi,
  Configuration,
  type UserUpdateRequest,
  type Pageable,
  type ApiResponseUserResponse,
  type ApiPaginatedResponseListUserResponse,
  type ApiResponseVoid,
} from "@/api";

const configuration = new Configuration({
  basePath: "http://localhost:8080",
  accessToken: `${localStorage.getItem("token")}`,
  baseOptions: {
    withCredentials: true,
    Origin: "http://localhost:5173",
  },
});

const userControllerApi = new UserControllerApi(configuration);

const userApi = {
  getCurrentUser: async (): Promise<ApiResponseUserResponse> => {
    const { data } = await userControllerApi.getCurrentUser();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch current user');
    }
    return data;
  },

  getUserById: async (userId: string): Promise<ApiResponseUserResponse> => {
    const { data } = await userControllerApi.getUserProfile(userId);
    if (!data.success) {
      throw new Error(data.message || `Failed to fetch user ${userId}`);
    }
    return data;
  },

  updateCurrentUser: async (
    request: UserUpdateRequest
  ): Promise<ApiResponseUserResponse> => {
    const { data } = await userControllerApi.updateCurrentUser(request);
    if (!data.success) {
      throw new Error(data.message || 'Failed to update user profile');
    }
    return data;
  },

  searchUsers: async (
    query: string,
    pageable?: Pageable
  ): Promise<ApiPaginatedResponseListUserResponse> => {
    const { data } = await userControllerApi.searchUsers(
      query, 
      pageable?.page, 
      pageable?.size
    );
    if (!data.success) {
      throw new Error(data.message || 'Failed to search users');
    }
    return data;
  },

  followUser: async (userId: string): Promise<ApiResponseVoid> => {
    const { data } = await userControllerApi.followUser(userId);
    if (!data.success) {
      throw new Error(data.message || 'Failed to follow user');
    }
    return data;
  },

  unfollowUser: async (userId: string): Promise<ApiResponseVoid> => {
    const { data } = await userControllerApi.unfollowUser(userId);
    if (!data.success) {
      throw new Error(data.message || 'Failed to unfollow user');
    }
    return data;
  },

  getFollowers: async (
    userId: string,
    pageable?: Pageable
  ): Promise<ApiPaginatedResponseListUserResponse> => {
    const { data } = await userControllerApi.getFollowers(
      userId, 
      pageable?.page, 
      pageable?.size
    );
    if (!data.success) {
      throw new Error(data.message || 'Failed to get followers');
    }
    return data;
  },

  getFollowing: async (
    userId: string,
    pageable?: Pageable
  ): Promise<ApiPaginatedResponseListUserResponse> => {
    const { data } = await userControllerApi.getFollowing(
      userId, 
      pageable?.page, 
      pageable?.size
    );
    if (!data.success) {
      throw new Error(data.message || 'Failed to get following');
    }
    return data;
  },
};

export default userApi;