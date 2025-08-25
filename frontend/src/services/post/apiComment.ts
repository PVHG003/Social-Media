import {
  CommentControllerApi,
  Configuration,
  type CommentRequestDto,
  type CommentUpdateDto,
  type ApiResponseCommentResponseDto,
  type ApiPaginatedResponseListCommentResponseDto,
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

const commentControllerApi = new CommentControllerApi(configuration);

const commentApi = {
  // Comment CRUD operations
  createComment: async (
    postId: string,
    request: CommentRequestDto
  ): Promise<ApiResponseCommentResponseDto> => {
    const { data } = await commentControllerApi.createComment(postId, request);
    if (!data.success) {
      throw new Error(data.message || `Failed to create comment on post ${postId}`);
    }
    return data;
  },

  getComment: async (commentId: string): Promise<ApiResponseCommentResponseDto> => {
    const { data } = await commentControllerApi.getComment(commentId);
    if (!data.success) {
      throw new Error(data.message || `Failed to fetch comment ${commentId}`);
    }
    return data;
  },

  updateComment: async (
    commentId: string,
    request: CommentUpdateDto
  ): Promise<ApiResponseCommentResponseDto> => {
    const { data } = await commentControllerApi.updateComment(commentId, request);
    if (!data.success) {
      throw new Error(data.message || `Failed to update comment ${commentId}`);
    }
    return data;
  },

  deleteComment: async (commentId: string): Promise<ApiResponseVoid> => {
    const { data } = await commentControllerApi.deleteComment(commentId);
    if (!data.success) {
      throw new Error(data.message || `Failed to delete comment ${commentId}`);
    }
    return data;
  },

  // Get comments by post
  getCommentsByPost: async (
    postId: string,
    page?: number,
    size?: number
  ): Promise<ApiPaginatedResponseListCommentResponseDto> => {
    const { data } = await commentControllerApi.getCommentsByPost(postId, page, size);
    if (!data.success) {
      throw new Error(data.message || `Failed to fetch comments for post ${postId}`);
    }
    return data;
  },

  // Get comments by user
  getCommentsByUser: async (
    userId: string,
    page?: number,
    size?: number
  ): Promise<ApiPaginatedResponseListCommentResponseDto> => {
    const { data } = await commentControllerApi.getCommentsByUser(userId, page, size);
    if (!data.success) {
      throw new Error(data.message || `Failed to fetch comments by user ${userId}`);
    }
    return data;
  },
};

export default commentApi;