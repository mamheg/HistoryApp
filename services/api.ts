import { User } from '../types';

const API_URL = '/api';

export const api = {
    async syncUser(tgUser: { id: number; first_name: string; last_name?: string; photo_url?: string }): Promise<User> {
        try {
            const response = await fetch(`${API_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: tgUser.id,
                    name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
                    avatar_url: tgUser.photo_url
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const backendUser = await response.json();

            // Transform backend response to frontend User type
            return {
                id: backendUser.id,
                name: backendUser.name,
                avatarUrl: backendUser.avatar_url,
                points: backendUser.points,
                lifetimePoints: backendUser.lifetime_points,
                level: backendUser.level_name,
                nextLevelPoints: backendUser.next_level_points,
                referralCode: `id${backendUser.id}`
            };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async updatePoints(userId: number, points: number, lifetimePoints: number): Promise<void> {
        console.log(`[API] Updating points for user ${userId}: ${points} (lifetime: ${lifetimePoints})`);
        try {
            const response = await fetch(`${API_URL}/users/${userId}/points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    points,
                    lifetime_points: lifetimePoints
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[API] Failed to update points: ${response.status} ${errorText}`);
                throw new Error(`Failed to update points: ${response.status}`);
            }
            console.log('[API] Points updated successfully');
        } catch (err) {
            console.error('[API] Error updating points:', err);
            throw err;
        }
    },

    async createOrder(orderData: {
        user_id: number;
        items_summary: string;
        total_price: number;
        points_used: number;
        pickup_time?: string;
        comment?: string;
    }): Promise<any> {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            throw new Error(`Order failed: ${response.status}`);
        }
        return response.json();
    },

    // Phase 3: Menu API
    async getMenu(): Promise<{ categories: any[] }> {
        // Add timestamp to prevent aggressive caching in Telegram WebView
        const timestamp = Date.now();
        const response = await fetch(`${API_URL}/menu?_t=${timestamp}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to load menu: ${response.status}`);
        }
        return response.json();
    },

    // Admin: Products
    async adminCreateProduct(adminId: number, product: any): Promise<any> {
        const response = await fetch(`${API_URL}/admin/products?admin_id=${adminId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            throw new Error(`Failed to create product: ${response.status}`);
        }
        return response.json();
    },

    async adminUpdateProduct(adminId: number, productId: number, updates: any): Promise<any> {
        const response = await fetch(`${API_URL}/admin/products/${productId}?admin_id=${adminId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error(`Failed to update product: ${response.status}`);
        }
        return response.json();
    },

    async adminDeleteProduct(adminId: number, productId: number): Promise<void> {
        const response = await fetch(`${API_URL}/admin/products/${productId}?admin_id=${adminId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete product: ${response.status}`);
        }
    },

    // Admin: Categories
    async adminCreateCategory(adminId: number, category: any): Promise<any> {
        const response = await fetch(`${API_URL}/admin/categories?admin_id=${adminId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!response.ok) {
            throw new Error(`Failed to create category: ${response.status}`);
        }
        return response.json();
    },

    async adminUpdateCategory(adminId: number, categoryId: string, updates: any): Promise<any> {
        const response = await fetch(`${API_URL}/admin/categories/${categoryId}?admin_id=${adminId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error(`Failed to update category: ${response.status}`);
        }
        return response.json();
    },

    async adminDeleteCategory(adminId: number, categoryId: string): Promise<void> {
        const response = await fetch(`${API_URL}/admin/categories/${categoryId}?admin_id=${adminId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete category: ${response.status}`);
        }
    }
};
