import { getStoredKeys, revealKey } from './keyStorageUtils.js';
import { handleError } from './errorHandler.js';
import { generateRandomKey } from './fileUtils.js';

export const storeKeyForFile = async (fileId, encryptionKey, label = '') => {
    try {
        const response = await fetch('/api/keys/store.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileId, encryptionKey, label }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to store encryption key');
        }
        
        return await response.json();
    } catch (error) {
        throw handleError(error);
    }
};

export const createNewKey = async (label) => {
    try {
        const key = generateRandomKey();
        const response = await fetch('/api/keys/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key, label }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create new key');
        }
        
        return await response.json();
    } catch (error) {
        throw handleError(error);
    }
};

export const updateKeyLabel = async (keyId, newLabel) => {
    try {
        const response = await fetch('/api/keys/update.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyId, label: newLabel }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update key label');
        }
        
        return await response.json();
    } catch (error) {
        throw handleError(error);
    }
};

export const getKeyForFile = async (fileId, password) => {
    try {
        const keys = await getStoredKeys();
        const keyEntry = keys.find(k => k.fileId === fileId);
        
        if (!keyEntry) {
            throw new Error('No encryption key found for this file');
        }
        
        return await revealKey(keyEntry.id, password);
    } catch (error) {
        throw handleError(error);
    }
};

export const initializeKeyManagement = () => {
    const filesList = document.getElementById('filesList');
    const createKeyBtn = document.getElementById('createKeyBtn');
    
    if (createKeyBtn) {
        createKeyBtn.addEventListener('click', () => {
            showCreateKeyModal();
        });
    }

    if (filesList) {
        filesList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('download-file')) {
                e.preventDefault();
                const fileId = e.target.dataset.fileId;
                showPasswordPrompt(fileId);
            }
        });
    }
};