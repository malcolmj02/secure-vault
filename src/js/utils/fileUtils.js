export const formatFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    bytes = Math.max(bytes, 0);
    const pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
    const unitIndex = Math.min(pow, units.length - 1);
    bytes /= Math.pow(1024, unitIndex);
    return `${bytes.toFixed(2)} ${units[unitIndex]}`;
};

export const generateRandomKey = () => {
    const length = 32;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(byte => chars[byte % chars.length])
        .join('');
};

export const showPasswordPrompt = (fileId) => {
    const modal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const verifyBtn = document.getElementById('verifyPasswordBtn');
    const passwordInput = document.getElementById('passwordVerification');
    
    const handleVerification = async () => {
        try {
            const password = passwordInput.value;
            const response = await fetch(`/api/files/download.php?id=${fileId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to download file');
            }
            
            await decryptAndDownloadFile(fileId, data.content, data.filename, password);
            modal.hide();
        } catch (error) {
            passwordInput.classList.add('is-invalid');
            document.querySelector('.invalid-feedback').textContent = error.message;
        }
    };
    
    verifyBtn.onclick = handleVerification;
    passwordInput.onkeyup = (e) => {
        if (e.key === 'Enter') handleVerification();
    };
    
    modal.show();
};