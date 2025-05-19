import db from '../db/db.js';

class LoginController {
    constructor() {

        // Cache the login form and logout button from the DOM
        this.loginForm = document.getElementById('login-form');
        this.logoutBtn = document.getElementById('logout-btn');

        // Initialize event listeners for login and logout actions
        this.initEventListeners();
    }

    initEventListeners() {

        // Attach submit event to login form
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Attach click event to logout button
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    handleLogin(e) {
        e.preventDefault(); // Prevent form from reloading the page

        // Get input values from form fields
        const username = this.loginForm.querySelector('input[type="text"]').value.trim();
        const password = this.loginForm.querySelector('input[type="password"]').value.trim();

        // Validate input fields
        if (!username || !password) {
            showAlert('⚠️ Please enter both username and password', 'warning');
            return;
        }
    }
}