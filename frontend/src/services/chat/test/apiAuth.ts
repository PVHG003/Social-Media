import {
  AuthControllerApi,
  Configuration,
  UserControllerApi,
  type LoginRequest,
  type RegisterRequest,
} from "@/api";

const authControllerApi = new AuthControllerApi();

const userConfig = new Configuration({
  accessToken: `Bearer ${localStorage.getItem("token")}`,
});
const userControllerApi = new UserControllerApi(userConfig);

const apiAuth = {
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

const apiUser = {
  getCurrentUser: async () => {
    const { data } = await userControllerApi.getCurrentUser();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};

export { apiUser, apiAuth };
