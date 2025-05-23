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

    handleSave() {
        let customerId = $("#customerId").val();
        let customerName = $('#customerName').val();
        let address = $('#address').val();
        let number = $('#contactNumber').val();

        if (customerId === '' || customerName === '' || address === '' || number === '') {
            Swal.fire("Error!", "Invalid Inputs", "error");
            return;
        }

        if (this.isDuplicated(customerId)) {
            Swal.fire("Error!", "Duplicate ID!", "error");
            return;
        }

        let customer_data = new CustomerModel(customerId, customerName, address, number);
        customer_db.push(customer_data);
        this.clearForm();
        this.loadCustomerTableData();

        Swal.fire("Success!", "Added Successfully", "success");
    }

    loadCustomerTableData() {
        $('#cus-body').empty();
        customer_db.forEach(item => {
            $('#cus-body').append(`
                <tr>
                    <td>${item.customerId}</td>
                    <td>${item.customerName}</td>
                    <td>${item.address}</td>
                    <td>${item.phoneNumber}</td>
                </tr>
            `);
        });
    }

    handleRowClick(e) {
        this.selectedIndex = $(e.currentTarget).index();
        let obj = customer_db[this.selectedIndex];
        $('#customerId').val(obj.customerId);
        $('#customerName').val(obj.customerName);
        $('#address').val(obj.address);
        $('#contactNumber').val(obj.phoneNumber);
    }


}

export default CustomerController;