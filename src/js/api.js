import axios from 'axios';
import { handleError } from './utils/errorHandler.js';
import { storeKeyForFile } from './utils/keyManagement.js';

export const authApi = {
    async login(email, password) {
        try {
            const response = await axios.post('/api/auth/login.php', { email, password });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    async signup(username, email, password) {
        try {
            const response = await axios.post('/api/auth/signup.php', { username, email, password });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    }
};

export const fileApi = {
    async uploadFile(file, encryptionKey) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/files/upload.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                await storeKeyForFile(response.data.fileId, encryptionKey);
            }
            
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    async getFiles() {
        try {
            const response = await axios.get('/api/files/list.php');
            return response.data.files || [];
        } catch (error) {
            throw handleError(error);
        }
    },

    async deleteFile(fileId) {
        try {
            const response = await axios.delete(`/api/files/delete.php?id=${fileId}`);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    }
};