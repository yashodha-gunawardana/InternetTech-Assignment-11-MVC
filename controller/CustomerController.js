import db from '../db/db.js';
import CustomerModel from '../model/CustomerModel.js';

class CustomerController {
    constructor() {
        this.model = new CustomerModel(db); // Connect model to DB
        this.initializeElements(); // Setup DOM references
        this.setupEventListeners(); // Hook event handlers
        this.loadCustomers(); // Load all customer data on init
    }

    // Initialize all DOM elements used by the controller
    initializeElements() {
        this.customerIdInput = document.querySelector('#customerId');
        this.customerNameInput = document.querySelector('#customerName');
        this.addressInput = document.querySelector('#address');
        this.contactNumberInput = document.querySelector('#contactNumber');
        this.table = document.querySelector('#customers-page table tbody');
        this.searchInput = document.querySelector('#customers-page .search-bar');
        this.viewAllBtn = document.querySelector('#customers-page .btn-view-all');
        this.addBtn = document.querySelector('#customers-page .btn-add');
        this.updateBtn = document.querySelector('#customers-page .btn-update');
        this.removeBtn = document.querySelector('#customers-page .btn-remove');
        this.resetBtn = document.querySelector('#customers-page .btn-secondary');
        this.goBackBtn = document.querySelector('#customers-page .btn-go-back');

        this.selectedCustomer = null; // Reset selected customer
    }
}