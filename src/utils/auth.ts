// Save tokens to localStorage
export const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

// Get tokens from localStorage
export const getTokens = () => {
    return {
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
    };
};

// Refresh token
export const refreshToken = async (refreshToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
                saveTokens(data.access_token, data.refresh_token);
                return data.access_token;
            } else {
                throw new Error('Failed to refresh token');
            }
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};
