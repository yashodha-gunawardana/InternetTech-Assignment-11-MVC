import * as db from '../db/db.js';

class LoginController {
    constructor() {
        this.loginForm = document.getElementById('login-form');
        this.logoutBtn = document.getElementById('logout-btn');

        this.initEventListeners();
    }


}

export default LoginController;