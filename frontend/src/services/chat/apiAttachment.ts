import {
  ChatMediaControllerApi,
  Configuration,
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

      const modData: ApiResponseListAttachmentResponse = {
        success: data.success,
        message: data.message,
        data: data.data?.map((att) => {
          return {
            attachmentId: att.attachmentId,
            filePath: `http://localhost:8080/${att.filePath}`,
            contentType: att.contentType,
            ...att,
          };
        }),
      };

      return modData;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  },
};

export default apiAttachment;
