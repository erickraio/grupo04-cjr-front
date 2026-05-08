

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const registerUser = async (userData: any) => {
    try {
        const response = await api.post('/user/register', userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {message: "Erro ao registrar usuário"};
    }
};

export default api;

