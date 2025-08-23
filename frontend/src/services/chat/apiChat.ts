import {
  ChatControllerApi,
  Configuration,
  type AddMembersRequest,
  type ApiPaginatedResponseListChatListResponse,
  type ApiPaginatedResponseListChatMessageResponse,
  type ApiResponseChatDetailResponse,
  type ApiResponseVoid,
  type ChatCreateRequest,
  type Pageable,
} from "@/api";
import axios from "axios";

// Create a custom axios instance
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8080", // adjust if needed
  headers: {
    Origin: "http://localhost:5173",
  },
});

// Add interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or missing → logout + go login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      // User is authenticated but forbidden → show error page or toast
      console.warn("Forbidden: no permission");
      // optionally redirect to a "No Access" page
      // navigate("/forbidden");
    }
    if (error.response?.status === 404) {
      // navigate("/not-found");
    }
    return Promise.reject(error);
  }
);

// Now inject this axios instance into your generated API
const configuration = new Configuration({
  accessToken: localStorage.getItem("token") ?? "",
  baseOptions: {
    adapter: axiosInstance.defaults.adapter, // 👈 key part, use our axios
  },
});

const chatControllerApi = new ChatControllerApi(configuration);

const chatApi = {
  getChatInfo: async (
    chatId: string
  ): Promise<ApiResponseChatDetailResponse> => {
    const { data } = await chatControllerApi.getChatInfo(chatId);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  updateChat: async (
    chatId: string,
    request: ChatCreateRequest
  ): Promise<ApiResponseChatDetailResponse> => {
    const { data } = await chatControllerApi.updateChat(chatId, request);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  deleteChat: async (chatId: string): Promise<ApiResponseVoid> => {
    const { data } = await chatControllerApi.deleteChat(chatId);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  getChatList: async (
    pageable: Pageable
  ): Promise<ApiPaginatedResponseListChatListResponse> => {
    const { data } = await chatControllerApi.getChatList(pageable);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  createChat: async (
    request: ChatCreateRequest
  ): Promise<ApiResponseChatDetailResponse> => {
    const { data } = await chatControllerApi.createChat(request);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  addMembers: async (
    chatId: string,
    request: AddMembersRequest
  ): Promise<ApiResponseChatDetailResponse> => {
    const { data } = await chatControllerApi.addMembers(chatId, request);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  getChatMessages: async (
    chatId: string,
    pageable: Pageable
  ): Promise<ApiPaginatedResponseListChatMessageResponse> => {
    const { data } = await chatControllerApi.getChatMessages(chatId, pageable);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  removeMember: async (
    chatId: string,
    userId: string
  ): Promise<ApiResponseChatDetailResponse> => {
    const { data } = await chatControllerApi.removeMember(chatId, userId);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};

export default chatApi;
