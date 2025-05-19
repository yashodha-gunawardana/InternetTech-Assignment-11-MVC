
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
