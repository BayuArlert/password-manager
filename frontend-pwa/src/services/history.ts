import api from './api';

export interface ActivityLog {
    id: number;
    action: string;
    description?: string;
    timestamp: string;
    password_id?: number;
}

export const historyService = {
    // Get activity history
    async getAll(limit: number = 50): Promise<ActivityLog[]> {
        const response = await api.get('/history', { params: { limit } });
        return response.data;
    }
};
