import { generateRandomKey } from './fileUtils.js';
import { copyToClipboard, downloadKey } from './keyUtils.js';
import { storeKeyForFile } from './keyManagement.js';
import { validateEncryptionKey, encryptFile } from './encryptionUtils.js';
import { fileApi } from '../api.js';

export const initializeEncryption = () => {
    const generateKeyBtn = document.getElementById('generateKey');
    const copyKeyBtn = document.getElementById('copyKey');
    const downloadKeyBtn = document.getElementById('downloadKey');
    const encryptionKeyInput = document.getElementById('encryptionKey');
    const confirmKeyInput = document.getElementById('confirmKey');
    const encryptForm = document.getElementById('encryptForm');

    if (generateKeyBtn) {
        generateKeyBtn.addEventListener('click', () => {
            const key = generateRandomKey();
            encryptionKeyInput.value = key;
            confirmKeyInput.value = key;
            encryptionKeyInput.type = 'text';
            confirmKeyInput.type = 'text';
            setTimeout(() => {
                encryptionKeyInput.type = 'password';
                confirmKeyInput.type = 'password';
            }, 5000);
        });
    }

    if (copyKeyBtn && encryptionKeyInput) {
        copyKeyBtn.addEventListener('click', async () => {
            const key = encryptionKeyInput.value;
            if (!key) {
                alert('Please generate or enter an encryption key first');
                return;
            }
            
            if (await copyToClipboard(key)) {
                const toast = new bootstrap.Toast(document.getElementById('copyToast'));
                toast.show();
            } else {
                alert('Failed to copy key to clipboard');
            }
        });
    }

    if (downloadKeyBtn && encryptionKeyInput) {
        downloadKeyBtn.addEventListener('click', () => {
            const key = encryptionKeyInput.value;
            if (!key) {
                alert('Please generate or enter an encryption key first');
                return;
            }
            downloadKey(key);
        });
    }

    if (encryptForm) {
        encryptForm.addEventListener('submit', handleFileEncryption);
    }
};

const handleFileEncryption = async (e) => {
    e.preventDefault();
    try {
        const file = document.getElementById('file').files[0];
        const key = document.getElementById('encryptionKey').value;
        const confirmKey = document.getElementById('confirmKey').value;
        const keyLabel = file.name; // Using filename as the default key label

        if (!file) {
            throw new Error('Please select a file');
        }

        validateEncryptionKey(key, confirmKey);
        const encryptedFile = await encryptFile(file, key);
        const response = await fileApi.uploadFile(encryptedFile.blob);
        
        if (response.success && response.fileId) {
            await storeKeyForFile(response.fileId, key, keyLabel);
            window.location.href = '/files.html';
        }
    } catch (error) {
        alert(error.message);
    }
};