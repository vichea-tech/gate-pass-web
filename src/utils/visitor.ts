import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';
import axios from 'axios';

const VISITOR_CACHE_KEY = 'visitor_list';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name = '', status = '' } = req.query;

        // Check cache
        const cachedVisitors = await redis.get(VISITOR_CACHE_KEY);
        if (cachedVisitors) {
            return res.status(200).json(JSON.parse(cachedVisitors));
        }

        // Fetch from external API
        const response = await axios.get(`${process.env.API_BASE_URL}/visitor`, {
            params: { name, status },
            headers: {
                Authorization: `Bearer ${req.headers.authorization}`
            }
        });

        // Cache the result
        const data = response.data;
        await redis.set(VISITOR_CACHE_KEY, JSON.stringify(data), 'EX', 3600); // Cache for 1 hour

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch visitors' });
    }
}
