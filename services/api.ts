import { User } from '../types';

const API_URL = 'http://localhost:8000/api';

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

            // Transform backend response to frontend User type if needed
            // Backend: id, name, avatar_url, points, lifetime_points, level_name, is_admin
            // Frontend User: id, name, avatarUrl, points, lifetimePoints, level, nextLevelPoints...

            // Calculate next level points based on frontend logic for now (until Phase 2)
            // Or just map what we have.
            return {
                id: backendUser.id,
                name: backendUser.name,
                avatarUrl: backendUser.avatar_url,
                points: backendUser.points,
                lifetimePoints: backendUser.lifetime_points,
                level: backendUser.level_name,
                // We still need these for UI, maybe calculate locally for now or add to backend response?
                // Backend doesn't send nextLevelPoints yet.
                // Let's use the helper from store? Or just 0 for safe fallback.
                nextLevelPoints: 0,
                referralCode: `id${backendUser.id}`
            };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
