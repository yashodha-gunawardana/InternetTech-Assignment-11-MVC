import * as db from '../db/db.js';

class LoginController {
    constructor() {
        this.loginForm = document.getElementById('login-form');
        this.logoutBtn = document.getElementById('logout-btn');

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    handleLogin(e) {
        e.preventDefault();

        const username = this.loginForm.querySelector('input[type="text"]').value.trim();
        const password = this.loginForm.querySelector('input[type="password"]').value.trim();

        if (!username || !password) {
            this.showAlert('⚠️ Please enter both username and password', 'warning');
            return;
        }

        if (db.authenticate(username, password)) {
            const displayName = db.currentUser.name || db.currentUser.username;

            this.showAlert(`✅ Login successfully..! Welcome ${displayName}! 🎉`, 'success');

            window.updateAuthUI?.();
            window.showPage?.('home-page');
        } else {
            this.showAlert('❌ Invalid username or password', 'error');
        }
    }

    handleLogout() {
        db.logout();

        this.showAlert('✅ Logged out successfully!', 'success');

        if (this.loginForm) {
            this.loginForm.querySelector('input[type="text"]').value = '';
            this.loginForm.querySelector('input[type="password"]').value = '';
        }

        window.updateAuthUI?.();
        window.showPage?.('login-page');
    }


}

export default LoginController;