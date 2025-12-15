import api from './api';

export interface Password {
    id?: number;
    title: string;
    username: string;
    encrypted_password: string;
    website?: string;
    notes?: string;
    category_id?: number;
    created_at?: string;
    updated_at?: string;
}

export const passwordService = {
    // Get all passwords
    async getAll(): Promise<Password[]> {
        const response = await api.get('/passwords');
        return response.data;
    },

    // Get single password
    async getById(id: number): Promise<Password> {
        const response = await api.get(`/passwords/${id}`);
        return response.data;
    },

    // Create new password
    async create(password: Omit<Password, 'id' | 'created_at' | 'updated_at'>): Promise<Password> {
        const response = await api.post('/passwords', password);
        return response.data;
    },

    // Update password
    async update(id: number, password: Partial<Password>): Promise<Password> {
        const response = await api.put(`/passwords/${id}`, password);
        return response.data;
    },

    // Delete password
    async delete(id: number): Promise<void> {
        await api.delete(`/passwords/${id}`);
    },

    // Generate random password
    async generate(length: number = 16, includeSymbols: boolean = true): Promise<string> {
        const response = await api.post('/passwords/generate', {
            length,
            include_symbols: includeSymbols
        });
        return response.data.password;
    },

    // Decrypt password
    async decrypt(id: number): Promise<string> {
        const response = await api.post<{ password: string }>(`/passwords/${id}/decrypt`);
        return response.data.password;
    }
};
