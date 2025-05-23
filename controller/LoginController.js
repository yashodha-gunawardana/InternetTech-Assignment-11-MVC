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


}

export default LoginController;