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

    handleAddCustomer(e) {
        e.preventDefault();
        const customerData = {
            name: this.customerNameInput.value,
            address: this.addressInput.value,
            contactNumber: this.contactNumberInput.value
        };

        try {
            const manualId = this.customerIdInput.value.trim(); // Optional manual ID
            this.model.create(customerData, manualId || undefined); // Insert customer
            this.loadCustomers(); // Refresh table
            this.resetForm(); // Clear form
            this.showSuccessMessage('✅ Customer added successfully!');
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    handleUpdateCustomer(e) {
        e.preventDefault();
        if (!this.selectedCustomer) {
            this.showErrorMessage('❌ Please select a customer to update');
            return;
        }

        const updatedData = {
            name: this.customerNameInput.value,
            address: this.addressInput.value,
            contactNumber: this.contactNumberInput.value
        };

        try {
            const updated = this.model.update(this.selectedCustomer.id, updatedData);
            if (updated) {
                this.loadCustomers();
                this.resetForm();
                this.showSuccessMessage('✅ Customer updated successfully!');
            } else {
                this.showErrorMessage('❌ Customer not found');
            }
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    handleRemoveCustomer(e) {
        e.preventDefault();
        if (!this.selectedCustomer) {
            this.showErrorMessage('❌ Please select a customer to remove');
            return;
        }

        if (confirm(`⚠️ Are you sure you want to delete ${this.selectedCustomer.name}?`)) {
            const removed = this.model.delete(this.selectedCustomer.id);
            if (removed) {
                this.loadCustomers();
                this.resetForm();
                this.showSuccessMessage('✅ Customer removed successfully!');
            } else {
                this.showErrorMessage('❌ Customer not found');
            }
        }
    }

    handleResetForm(e) {
        e.preventDefault();
        this.resetForm();
    }

    handleTableClick(e) {
        const row = e.target.closest('tr');
        if (row) {
            this.selectCustomer(row.dataset.id); // Load selected row data to form
        }
    }

    handleSearch() {
        const query = this.searchInput.value.trim();
        const results = this.model.search(query);
        this.renderCustomers(results); // Show filtered results
    }

    handleViewAll() {
        this.searchInput.value = '';
        this.loadCustomers(); // Reload all customers
    }

    selectCustomer(customerId) {
        const customer = this.model.findById(customerId);
        if (customer) {
            this.selectedCustomer = customer;
            this.customerIdInput.value = customer.id;
            this.customerNameInput.value = customer.name;
            this.addressInput.value = customer.address;
            this.contactNumberInput.value = customer.contactNumber;

            // Highlight selected row
            document.querySelectorAll('#customers-page table tbody tr').forEach(row => {
                row.classList.remove('table-primary');
                if (row.dataset.id === customerId) {
                    row.classList.add('table-primary');
                }
            });
        }
    }



}