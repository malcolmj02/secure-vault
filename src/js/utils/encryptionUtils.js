import CryptoJS from 'crypto-js';

export const validateEncryptionKey = (key, confirmKey) => {
    if (!key || !confirmKey) {
        throw new Error('Encryption key is required');
    }

    if (key !== confirmKey) {
        throw new Error('Encryption keys do not match');
    }

    if (key.length < 16) {
        throw new Error('Encryption key must be at least 16 characters long');
    }

    return true;
};

export const encryptFile = (file, key) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const fileContent = event.target.result;
                const encrypted = CryptoJS.AES.encrypt(fileContent, key);
                const encryptedBlob = new Blob([encrypted.toString()], { type: 'application/encrypted' });
                
                resolve({
                    blob: encryptedBlob,
                    originalName: file.name,
                    size: encryptedBlob.size
                });
            } catch (error) {
                reject(new Error('Encryption failed: ' + error.message));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

export const decryptFile = (encryptedContent, key) => {
    try {
        return CryptoJS.AES.decrypt(encryptedContent, key).toString(CryptoJS.enc.Utf8);
    } catch (error) {
        throw new Error('Failed to decrypt file: ' + error.message);
    }
};