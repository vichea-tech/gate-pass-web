import axios from 'axios';
import { visitor } from '@/types/visitor'; // Adjust import path as needed

export const fetchVisitor = async (id: string): Promise<visitor | null> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/${id}`);
        return response.data.visitor;
    } catch (error) {
        console.error('Error fetching visitor data:', error);
        return null;
    }
};
