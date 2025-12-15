import api from './api';

interface AuthResponse {
    user_id: number;
    token: string;
    message: string;
}

interface SetupCheckResponse {
    setup_complete: boolean;
    biometric_enabled: boolean;
}

export const authService = {
    // Initialize master password (first time setup)
    async initialize(masterPassword: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/setup', {
            master_password: masterPassword,
            biometric_enabled: false
        });

        // Save token and master password (temporarily for session)
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id.toString());
        sessionStorage.setItem('master_password', masterPassword);

        return response.data;
    },

    // Check if master password is initialized
    async checkInitialized(): Promise<boolean> {
        const response = await api.get<SetupCheckResponse>('/auth/check');
        return response.data.setup_complete;
    },

    // Login with master password
    async login(masterPassword: string): Promise<string> {
        const response = await api.post<AuthResponse>('/auth/login', {
            master_password: masterPassword
        });

        const token = response.data.token;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_id', response.data.user_id.toString());
        sessionStorage.setItem('master_password', masterPassword);

        return token;
    },

    // Logout
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        window.location.href = '/';
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }
};
