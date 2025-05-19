import db from '../db/db.js';
import CustomerModel from '../model/CustomerModel.js';

class CustomerController {
    constructor() {
        this.model = new CustomerModel(db);
        this.initializeElements(); // Setup DOM references
        this.setupEventListeners(); // Hook event handlers
        this.loadCustomers();
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

    setupEventListeners() {
        this.addBtn?.addEventListener('click', (e) => this.handleAddCustomer(e));
        this.updateBtn?.addEventListener('click', (e) => this.handleUpdateCustomer(e));
        this.removeBtn?.addEventListener('click', (e) => this.handleRemoveCustomer(e));
        this.resetBtn?.addEventListener('click', (e) => this.handleResetForm(e));
        this.goBackBtn?.addEventListener('click', (e) => this.handleGoBack(e));
        this.table?.addEventListener('click', (e) => this.handleTableClick(e));
        this.searchInput?.addEventListener('input', () => this.handleSearch());
        this.viewAllBtn?.addEventListener('click', () => this.handleViewAll());
    }

    handleGoBack(e) {
        e.preventDefault();
        showPage('home-page'); // Redirect to home page
    }

}