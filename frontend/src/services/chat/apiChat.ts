import {
  ChatControllerApi,
  Configuration,
  type AddMembersRequest,
  type ChatCreateRequest,
  type Pageable,
} from "@/api";

const configuration = new Configuration({
  basePath: "http://localhost:8080",
  accessToken: `Bearer ${localStorage.getItem("token")}`,
  baseOptions: {
    withCredentials: true,
    Origin: "http://localhost:5173",
  },
});

const chatControllerApi = new ChatControllerApi(configuration);

const chatApi = {
  getChatInfo: async (chatId: string) => {
    const { data } = await chatControllerApi.getChatInfo(chatId);
    if (!data.success) {
      throw new Error();
    }
    return data;
  },
  updateChat: async (chatId: string, request: ChatCreateRequest) => {
    const { data } = await chatControllerApi.updateChat(chatId, request);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  deleteChat: async (chatId: string) => {
    const { data } = await chatControllerApi.deleteChat(chatId);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  getChatList: async (pageable: Pageable) => {
    const { data } = await chatControllerApi.getChatList(pageable);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  createChat: async (request: ChatCreateRequest) => {
    const { data } = await chatControllerApi.createChat(request);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  addMembers: async (chatId: string, request: AddMembersRequest) => {
    const { data } = await chatControllerApi.addMembers(chatId, request);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  getChatMessages: async (chatId: string, pageable: Pageable) => {
    const { data } = await chatControllerApi.getChatMessages(chatId, pageable);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  removeMember: async (chatId: string, userId: string) => {
    const { data } = await chatControllerApi.removeMember(chatId, userId);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};

export default chatApi;
