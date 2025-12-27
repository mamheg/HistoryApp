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
    }
};
