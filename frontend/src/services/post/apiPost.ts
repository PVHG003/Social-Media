import {
  PostControllerApi,
  Configuration,
  type PostUpdateRequest,
  type ApiResponsePostResponse,
  type ApiPaginatedResponseListPostResponse,
  type ApiResponseVoid,
} from "@/api";

const configuration = new Configuration({
  basePath: "http://localhost:8080",
  accessToken: localStorage.getItem("token") ?? "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJVc2VyIEFjY2VzcyIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiU29jaWFsIE1lZGlhIiwiZXhwIjoxNzU1OTg2NDY0LCJpYXQiOjE3NTU5ODI4NjQsInVzZXJJZCI6ImVlNjU1NDkxLTE5OWYtNGUzNS1iYzZiLTZjMGQxMzg0Mjk3ZCIsImVtYWlsIjoiaGlldWt2MjYxMDIwMDNAZ21haWwuY29tIn0.OVnBghpHvLfKgwwEyH8ul14lLbRYZmUdqtoaaL3o-r93TfPeNugEZ_13vYRxMu4H81vU8QYP8l87D6svCWOKuPeo7e7UZ9ttjZMxgeRDnz-xhQcof3Hymhi0TWyylWB9OyDtR2dDj8iCObjvZX0liUOHyTsmVq75nnKIX3LryxB5oXOF6AUIW4hkXec-6XSOPP41Kfv2x6LyFu6JpdQUzjmGfK_PGF6m-DVWfUBB3p5p20S44IQQkejPFQw1HCO7p6cC8lyBDMfMi2bM5o7CUdvss1PXkDP5mpAmGpZV7j5UPkQzJcBS_qrYStCTeZ7UUPR0V0S8bqvQMU9fSgvoMA",
  baseOptions: {
    withCredentials: true,
    Origin: "http://localhost:5173",
  },
});

const postControllerApi = new PostControllerApi(configuration);

const postApi = {
  // Post operations
  createPost: async (
    content?: string,
    mediaFiles?: Array<File>
  ): Promise<ApiResponsePostResponse> => {
    const { data } = await postControllerApi.createPost(content, mediaFiles);
    if (!data.success) {
      throw new Error(data.message || 'Failed to create post');
    }
    return data;
  },

  getPost: async (postId: string): Promise<ApiResponsePostResponse> => {
    const { data } = await postControllerApi.getPost(postId);
    if (!data.success) {
      throw new Error(data.message || `Failed to fetch post ${postId}`);
    }
    return data;
  },

  getAllPosts: async (
    page?: number,
    size?: number
  ): Promise<ApiPaginatedResponseListPostResponse> => {
    const { data } = await postControllerApi.getAllPosts(page, size);
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch posts');
    }
    return data;
  },

  getPostsByUser: async (
    userId: string,
    page?: number,
    size?: number
  ): Promise<ApiPaginatedResponseListPostResponse> => {
    const { data } = await postControllerApi.getPostsByUser(userId, page, size);
    if (!data.success) {
      throw new Error(data.message || `Failed to fetch posts by user ${userId}`);
    }
    return data;
  },

  updatePost: async (
    postId: string,
    request: PostUpdateRequest
  ): Promise<ApiResponsePostResponse> => {
    const { data } = await postControllerApi.updatePost(postId, request);
    if (!data.success) {
      throw new Error(data.message || `Failed to update post ${postId}`);
    }
    return data;
  },

  deletePost: async (postId: string): Promise<ApiResponseVoid> => {
    const { data } = await postControllerApi.deletePost(postId);
    if (!data.success) {
      throw new Error(data.message || `Failed to delete post ${postId}`);
    }
    return data;
  },

  // Like operations
  likePost: async (postId: string): Promise<ApiResponsePostResponse> => {
    const { data } = await postControllerApi.likePost(postId);
    if (!data.success) {
      throw new Error(data.message || `Failed to like post ${postId}`);
    }
    return data;
  },

  unlikePost: async (postId: string): Promise<ApiResponsePostResponse> => {
    const { data } = await postControllerApi.unlikePost(postId);
    if (!data.success) {
      throw new Error(data.message || `Failed to unlike post ${postId}`);
    }
    return data;
  },
};

export default postApi;