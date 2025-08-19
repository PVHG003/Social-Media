import { userControllerApi } from "./client";

const userApi = {
  getAllUser: async () => {
    const { data } = await userControllerApi.getAllUsers();
    if (!data.success) {
      throw new Error(data.message ?? "Failed to fetch users");
    }
    return data;
  },
};

export default userApi;
