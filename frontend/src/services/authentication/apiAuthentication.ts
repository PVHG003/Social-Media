    import {
        AuthControllerApi,
        Configuration,
        type ChangePasswordRequest,
        type LoginRequest,
        type RegisterRequest,
        type PasswordResetRequest,
        type ApiResponseAuthenticatedResponse,
        type ApiResponseVoid,
    }   from "@/api";

    const configuration = new Configuration({
        basePath: "http://localhost:8080",
        accessToken: () => localStorage.getItem("token") ?? "",
        baseOptions: {
            withCredentials: true,
            Origin: "http://localhost:5173",
        },
    });

    const authControllerApi = new AuthControllerApi(configuration);

    const authApi = {
        // Đăng nhập người dùng
        login: async (
            request: LoginRequest
        ): Promise<ApiResponseAuthenticatedResponse> => {
            const { data } = await authControllerApi.login(request);
            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }
            return data;
        },

        // đăng kí tài khoản mới
        register : async (
            request: RegisterRequest
        ): Promise<ApiResponseVoid> => {
            const { data } = await authControllerApi.register(request);
            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }
            return data;
        },

        // đăng xuất người dùng
        logout : async (): Promise<ApiResponseVoid> => {
            const { data } = await authControllerApi.logout();
            if (!data.success) {
                throw new Error(data.message || 'Logout failed');
            }
            return data;
        },
        
        verify: async (
            email : string,
            code : string
        ): Promise<ApiResponseAuthenticatedResponse> => {
            const { data } = await authControllerApi.verify(email, code);
            if (!data.success) {
                throw new Error(data.message || 'Verification failed');
            }
            return data;
        }, 

        sendCode: async (
            email: string
        ): Promise<ApiResponseVoid> => {
            const { data } = await authControllerApi.sendCode(email);
            if (!data.success) {
                throw new Error(data.message || 'Failed to send verification code');
            }
            return data;
        },

        forgotPassword: async (
            email : string
        ): Promise<ApiResponseVoid> => {
            const { data } = await authControllerApi.forgotPassword(email);
            if (!data.success) {
                throw new Error(data.message || 'Failed to send forgot password email');
            }
            return data;
        },

        resetPassword: async (
            request: PasswordResetRequest
        ): Promise<ApiResponseVoid> => {
            const { data } = await authControllerApi.resetPassword(request);
            if (!data.success) {
                throw new Error(data.message || 'Failed to reset password');
            }
            return data;
        },

        changePassword: async (
            request: ChangePasswordRequest
        ): Promise<ApiResponseAuthenticatedResponse> => {
            const { data } = await authControllerApi.changePassword(request);
            if (!data.success) {
                throw new Error(data.message || 'Failed to change password');
            }
            return data;
        },
    }

    export default authApi;



