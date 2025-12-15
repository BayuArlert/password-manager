import api from './api';

export interface Category {
    id?: number;
    name: string;
    color: string;
    created_at?: string;
}

export const categoryService = {
    // Get all categories
    async getAll(): Promise<Category[]> {
        const response = await api.get('/categories/');
        return response.data;
    },

    // Create new category
    async create(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
        const response = await api.post('/categories/', category);
        return response.data;
    },

    // Update category
    async update(id: number, category: Partial<Category>): Promise<Category> {
        const response = await api.put(`/categories/${id}`, category);
        return response.data;
    },

    // Delete category
    async delete(id: number): Promise<void> {
        await api.delete(`/categories/${id}`);
    }
};
