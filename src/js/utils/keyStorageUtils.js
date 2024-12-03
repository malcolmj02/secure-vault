import axios from 'axios';
import { handleError } from './errorHandler.js';

export const getStoredKeys = async () => {
    try {
        const response = await axios.get('/api/keys/list.php');
        return response.data.keys || [];
    } catch (error) {
        throw handleError(error);
    }
};

export const verifyPassword = async (password) => {
    try {
        const response = await axios.post('/api/keys/verify.php', { password });
        return response.data.success;
    } catch (error) {
        throw handleError(error);
    }
};

export const revealKey = async (keyId, password) => {
    try {
        const response = await axios.post('/api/keys/reveal.php', { 
            keyId, 
            password 
        });
        return response.data.key;
    } catch (error) {
        throw handleError(error);
    }
};