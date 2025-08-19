import type { AddMembersRequest, ChatCreateRequest, Pageable } from "@/api";
import { chatControllerApi } from "./client";

const chatApi = {
  getChatInfo: async (chatId: string) => {
    const { data } = await chatControllerApi.getChatInfo(chatId);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  // updateChat: async (chatId: string) => {
  //   const { data } = await chatControllerApi.updateChat(chatId);
  // },
  // deleteChat: async () => {},
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
  // removeMember: async () => {

  // },
};

export default chatApi;
