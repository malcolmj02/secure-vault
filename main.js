import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { authApi, fileApi } from './src/js/api.js';
import { updateStorageDisplay } from './src/js/utils/storageUtils.js';
import { createNav } from './src/components/nav.js';
import { initializeEncryption } from './src/js/utils/encryptionHandler.js';
import { initializeKeyManagement } from './src/js/utils/keyManagement.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize navigation
    const navContainer = document.querySelector('nav');
    if (navContainer) {
        navContainer.outerHTML = await createNav();
    }

    initializeAuth();
    initializeKeyManagement();
    
    // Initialize encryption handlers on encrypt page
    if (window.location.pathname === '/encrypt.html') {
        initializeEncryption();
    }
    
    // Update storage display on dashboard
    if (window.location.pathname === '/dashboard.html') {
        updateStorageDisplay();
    }
});

function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                await authApi.login(email, password);
                window.location.href = '/dashboard.html';
            } catch (error) {
                alert(error);
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                await authApi.signup(username, email, password);
                window.location.href = '/login.html';
            } catch (error) {
                alert(error);
            }
        });
    }
}