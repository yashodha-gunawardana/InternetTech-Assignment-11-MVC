
import db from './db/db.js';
import LoginController from './controller/LoginController.js';
import CustomerController from './controller/CustomerController.js';
import ItemController from './controller/ItemController.js';
import OrderController from './controller/OrderController.js';

window.showAlert = function(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fixed-top mx-auto mt-3`;
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.zIndex = '1100';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
};

document.addEventListener('DOMContentLoaded', function() {
    // Global page router
    window.showPage = function(pageId) {
        const protectedPages = ['home-page', 'customers-page', 'items-page', 'orders-page'];

        if (protectedPages.includes(pageId)) {
            if (!db.currentUser) {
                showPage('login-page');
                window.showAlert('🔒 Please login first!', 'warning');
                return;
            }
        }

        // Hide all pages
        document.querySelectorAll('.main-container, .main-content').forEach(el => {
            el.style.display = 'none';
        });

        // Show the requested page
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.style.display = 'block';

            switch(pageId) {
                case 'login-page':
                    new LoginController();
                    break;
                case 'customers-page':
                    new CustomerController();
                    break;
                case 'items-page':
                    new ItemController();
                    break;
                case 'orders-page':
                    new OrderController();
                    break;
            }
        }
    };
});

window.updateAuthUI = function() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    if (db.currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (navLinks) navLinks.forEach(link => link.style.display = 'block');
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (navLinks) navLinks.forEach(link => link.style.display = 'block');
    }
};