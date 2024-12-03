import CryptoJS from 'crypto-js';
import { getKeyForFile } from './keyManagement.js';

export const decryptAndDownloadFile = async (fileId, encryptedContent, filename, password) => {
    try {
        const key = await getKeyForFile(fileId, password);
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, key).toString(CryptoJS.enc.Utf8);
        
        // Convert base64 to blob
        const byteString = atob(decrypted.split(',')[1]);
        const mimeString = decrypted.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        throw new Error(`Failed to decrypt file: ${error.message}`);
    }
};