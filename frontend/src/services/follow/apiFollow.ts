/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserControllerApi,
  Configuration,
  type Pageable,
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

const followApi = {
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

  getUserFollowers: async (
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

  getUserFollowing: async (
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

  toggleFollow: async (
    userId: string,
    currentlyFollowing: boolean
  ): Promise<boolean> => {
    if (currentlyFollowing) {
      await followApi.unfollowUser(userId);
      return false;
    } else {
      await followApi.followUser(userId);
      return true;
    }
  },
};

export default followApi;