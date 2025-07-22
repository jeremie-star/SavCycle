import axios from 'axios';

// Define types for user data and credentials
interface UserData {
    full_name: string;
    phone_number: string;
    email: string;
    password: string;
    role: string;
}

interface Credentials {
    // Adjust these fields according to your actual credentials structure
    email: string;
    password: string;
}

const API_URL = 'http://localhost:3001/api/auth'; // Replace with your actual backend API URL

export const signup = (userData: UserData) => axios.post(`${API_URL}/signup`, userData);

export const login = (credentials: Credentials) => axios.post(`${API_URL}/login`, credentials);

export const logout = () => axios.post(`${API_URL}/logout`);