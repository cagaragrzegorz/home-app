import axios from "axios";

const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API call failed:', error);
        if (error.response.status === 401) {
            console.error('Unauthorized', error);
        } else if (error.response.status === 404) {
            console.error('Not found:', error);
        }
        return Promise.reject(error);
    }
);
export default apiClient;