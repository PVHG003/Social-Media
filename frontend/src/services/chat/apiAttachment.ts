import {
  ChatMediaControllerApi,
  Configuration,
  type ApiResponseChatDetailResponse,
  type ApiResponseListAttachmentResponse,
} from "@/api";

const configuration = new Configuration({
  accessToken: localStorage.getItem("token") ?? "",
  baseOptions: {
    withCredentials: true,
    Origin: "http://localhost:5173",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
});

const chatMediaControllerApi = new ChatMediaControllerApi(configuration);

const apiAttachment = {
  upload: async (
    chatId: string,
    files: Array<File>
  ): Promise<ApiResponseListAttachmentResponse> => {
    try {
      const { data } = await chatMediaControllerApi.uploadAttachments(
        chatId,
        files
      );

      return data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  },

  groupImage: async (
    chatId: string,
    file: File
  ): Promise<ApiResponseChatDetailResponse> => {
    try {
      const { data } = await chatMediaControllerApi.uploadGroupImage(
        chatId,
        file
      );
      return data;
    } catch (error) {
      console.error("Error uploading group image:", error);
      throw error;
    }
  },
};

export default apiAttachment;
