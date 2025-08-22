import {
  AuthControllerApi,
  UserControllerApi,
  type LoginRequest,
  type RegisterRequest,
} from "@/api";

const authControllerApi = new AuthControllerApi();

const userControllerApi = new UserControllerApi();

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
  getCurrentUser: async (token: string) => {
    const { data } = await userControllerApi.getCurrentUser({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
  searchUsers: async (
    query: string,
    pageable: { page: number | 0; size: number | 10 },
    token: string | null
  ) => {
    const { data } = await userControllerApi.searchUsers(
      query,
      pageable.page,
      pageable.size,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};

export { apiAuth, apiUser };
