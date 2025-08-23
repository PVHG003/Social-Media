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

const configuration = new Configuration({
  accessToken: localStorage.getItem("token") ?? "",
  baseOptions: {
    withCredentials: true,
    Origin: "http://localhost:5173",
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
