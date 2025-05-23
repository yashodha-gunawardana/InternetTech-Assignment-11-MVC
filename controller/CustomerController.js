import { customer_db } from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

class CustomerController {
    constructor() {
        this.selectedIndex = -1;
        this.initialize();
    }

    initialize() {
        this.bindEvents();
        this.loadCustomerTableData();
        this.setupValidation();
    }

    bindEvents() {
        $('#customer-save').on("click", () => this.handleSave());
        $('#cus-body').on('click', 'tr', (e) => this.handleRowClick(e));
        $('#customer-clear').on('click', () => this.clearForm());
        $('#customer-update').on('click', () => this.handleUpdate());
        $('#customer-delete').on('click', () => this.handleDelete());
        $('.search-bar').on('input', () => this.handleSearch());
        $('.btn-view-all').on('click', () => this.loadCustomerTableData());
        $('.btn-go-back').on('click', () => window.history.back());
    }


}

export default CustomerController;