import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://width-emphasis-crayon.ngrok-free.dev/api',
    withCredentials: true, // For sending cookies
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
    }
});

export default api;
