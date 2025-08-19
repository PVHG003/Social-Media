import type { LoginRequest, RegisterRequest } from "@/api";
import { authControllerApi } from "./client";

const authApi = {
  login: async (loginRequest: LoginRequest) => {
    const { data } = await authControllerApi.login(loginRequest);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  register: async (registerRequest: RegisterRequest) => {
    const { data } = await authControllerApi.register(registerRequest);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};

export default authApi;
