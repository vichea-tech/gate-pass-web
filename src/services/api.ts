import axios, { Method } from 'axios';

type FetchDataResponse = {
    [key: string]: any; // Adjust this according to the expected response structure
}

async function fetchData(
    method: Method,
    url: string,
    data?: any
): Promise<FetchDataResponse | undefined> {
    try {
        const token = localStorage.getItem('access_token');

        if (!token) {
            window.location.href = "/login";
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        const response = await axios({
            method: method,
            url: url,
            data: data,
            headers: headers,
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            window.location.href = "/login";
            return;
        }
        console.error("Error fetching data:", error);
        throw error;
    }
}

export default fetchData;
