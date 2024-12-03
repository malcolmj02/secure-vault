import axios from 'axios';
import { handleError } from './errorHandler.js';
import { formatFileSize } from './fileUtils.js';

export const updateStorageDisplay = async () => {
    try {
        const response = await axios.get('/api/storage/quota.php');
        const data = response.data;
        
        if (!data || typeof data.used !== 'number' || typeof data.total !== 'number') {
            throw new Error('Invalid storage data received from server');
        }
        
        const storageText = document.getElementById('storageText');
        const progressBar = document.getElementById('storageProgress');
        
        if (!storageText || !progressBar) {
            throw new Error('Storage display elements not found');
        }
        
        const usedFormatted = formatFileSize(data.used);
        const totalFormatted = formatFileSize(data.total);
        const percentage = Math.min((data.used / data.total) * 100, 100);
        
        storageText.textContent = `${usedFormatted} of ${totalFormatted} used`;
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
        
        // Update progress bar color based on usage
        progressBar.classList.remove('bg-primary', 'bg-warning', 'bg-danger');
        if (percentage > 90) {
            progressBar.classList.add('bg-danger');
        } else if (percentage > 70) {
            progressBar.classList.add('bg-warning');
        } else {
            progressBar.classList.add('bg-primary');
        }
    } catch (error) {
        console.error('Failed to update storage display:', error);
        const storageText = document.getElementById('storageText');
        if (storageText) {
            storageText.textContent = 'Error loading storage information';
            storageText.classList.add('text-danger');
        }
    }
};