import db from '../db/db.js';
import ItemModel from "../model/ItemModel.js";

class ItemController {
    constructor() {
        this.model = new ItemModel(db);
        this.initializeElements();
        this.setupEventListeners();
        this.loadItems();
    }

    initializeElements() {
        //this.form = document.querySelector('#items-page');
        this.itemIdInput = document.querySelector('#itemId');
        this.itemNameInput = document.querySelector('#itemName');
        this.quantityInput = document.querySelector('#itemQuantity');
        this.priceInput = document.querySelector('#price');
        this.table = document.querySelector('#items-page table tbody');
        this.searchInput = document.querySelector('#items-page .search-bar');
        this.viewAllBtn = document.querySelector('#items-page .btn-view-all');
        this.addBtn = document.querySelector('#items-page .btn-add');
        this.updateBtn = document.querySelector('#items-page .btn-update');
        this.removeBtn = document.querySelector('#items-page .btn-remove');
        this.resetBtn = document.querySelector('#items-page .btn-secondary');
        this.goBackBtn = document.querySelector('#items-page .btn-go-back');

        this.selectedItem = null;
    }

    setupEventListeners() {
        this.addBtn?.addEventListener('click', (e) => this.handleAddItem(e));
        this.updateBtn?.addEventListener('click', (e) => this.handleUpdateItem(e));
        this.removeBtn?.addEventListener('click', (e) => this.handleRemoveItem(e));
        this.resetBtn?.addEventListener('click', (e) => this.handleResetForm(e));
        this.goBackBtn?.addEventListener('click', (e) => this.handleGoBack(e));
        this.table?.addEventListener('click', (e) => this.handleTableClick(e));
        this.searchInput?.addEventListener('input', () => this.handleSearch());
        this.viewAllBtn?.addEventListener('click', () => this.handleViewAll());
    }

    handleGoBack(e) {
        e.preventDefault();
        showPage('home-page');
    }

    handleAddItem(e) {
        e.preventDefault();
        const itemData = {
            name: this.itemNameInput.value,
            quantity: this.quantityInput.value,
            price: this.priceInput.value
        };

        try {
            const manualId = this.itemIdInput.value.trim(); // Get the manually entered ID
            this.model.create(itemData, manualId || undefined); // Pass it if provided
            this.loadItems();
            this.resetForm();
            this.showSuccessMessage('✅ Item added successfully!');
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    handleUpdateItem(e) {
        e.preventDefault();
        if (!this.selectedItem) {
            this.showErrorMessage('❌ Please select an item to update');
            return;
        }

        const updatedData = {
            name: this.itemNameInput.value,
            quantity: this.quantityInput.value,
            price: this.priceInput.value
        };

        try {
            const updated = this.model.update(this.selectedItem.id, updatedData);
            if (updated) {
                this.loadItems();
                this.resetForm();
                this.showSuccessMessage('✅ Item updated successfully!');
            } else {
                this.showErrorMessage('❌ Item not found');
            }
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    handleRemoveItem(e) {
        e.preventDefault();
        if (!this.selectedItem) {
            this.showErrorMessage('❌ Please select an item to remove');
            return;
        }

        if (confirm(`⚠️ Are you sure you want to delete ${this.selectedItem.name}?`)) {
            const removed = this.model.delete(this.selectedItem.id);
            if (removed) {
                this.loadItems();
                this.resetForm();
                this.showSuccessMessage('✅ Item removed successfully!');
            } else {
                this.showErrorMessage('❌ Item not found');
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
            this.selectItem(row.dataset.id);
        }
    }

    handleSearch() {
        const query = this.searchInput.value.trim();
        const results = this.model.search(query);
        this.renderItems(results);
    }

    handleViewAll() {
        this.searchInput.value = '';
        this.loadItems();
    }

    selectItem(itemId) {
        const item = this.model.findById(itemId);
        if (item) {
            this.selectedItem = item;
            this.itemIdInput.value = item.id;
            this.itemNameInput.value = item.name;
            this.quantityInput.value = item.quantity;
            this.priceInput.value = item.price;

            // Highlight selected row
            document.querySelectorAll('#items-page table tbody tr').forEach(row => {
                row.classList.remove('table-primary');
                if (row.dataset.id === itemId) {
                    row.classList.add('table-primary');
                }
            });
        }
    }

    loadItems() {
        const items = this.model.findAll();
        this.renderItems(items);
    }

    renderItems(items) {
        this.table.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
            `;
            this.table.appendChild(row);
        });
    }

    resetForm() {
        this.itemIdInput.value = '';
        this.itemNameInput.value = '';
        this.quantityInput.value = '';
        this.priceInput.value = '';
        this.selectedItem = null;

        // Remove highlight from all rows
        document.querySelectorAll('#items-page table tbody tr').forEach(row => {
            row.classList.remove('table-primary');
        });
    }

    showSuccessMessage(message) {
        alert(message); // Replace with a toast notification if preferred
    }

    showErrorMessage(message) {
        alert(message); // Replace with a toast notification if preferred
    }
}

export default ItemController;