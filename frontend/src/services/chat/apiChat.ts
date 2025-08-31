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
  accessToken: localStorage.getItem("token") || undefined,
});

const chatControllerApi = new ChatControllerApi(configuration);

const handleApi = async (promise: Promise<any>) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

const chatApi = {
  chat: {
    getInfo: (chatId: string): Promise<ApiResponseChatDetailResponse> =>
      handleApi(chatControllerApi.getChatInfo(chatId)),

    update: (
      chatId: string,
      req: ChatCreateRequest
    ): Promise<ApiResponseChatDetailResponse> =>
      handleApi(chatControllerApi.updateChat(chatId, req)),

    delete: (chatId: string): Promise<ApiResponseVoid> =>
      handleApi(chatControllerApi.deleteChat(chatId)),

    list: (p: Pageable): Promise<ApiPaginatedResponseListChatListResponse> =>
      handleApi(chatControllerApi.getChatList(p)),

    create: (req: ChatCreateRequest): Promise<ApiResponseChatDetailResponse> =>
      handleApi(chatControllerApi.createChat(req)),
  },

  members: {
    add: (
      chatId: string,
      req: AddMembersRequest
    ): Promise<ApiResponseChatDetailResponse> =>
      handleApi(chatControllerApi.addMembers(chatId, req)),

    remove: (
      chatId: string,
      userId: string
    ): Promise<ApiResponseChatDetailResponse> =>
      handleApi(chatControllerApi.removeMember(chatId, userId)),
  },

  messages: {
    list: (
      chatId: string,
      p: Pageable
    ): Promise<ApiPaginatedResponseListChatMessageResponse> =>
      handleApi(chatControllerApi.getChatMessages(chatId, p)),
  },
};

export default chatApi;
