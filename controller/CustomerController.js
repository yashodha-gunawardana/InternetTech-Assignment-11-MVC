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

    clearForm() {
        $('#customerId, #customerName, #address, #contactNumber').val("");
        this.selectedIndex = -1;
    }

    handleUpdate() {
        if (this.selectedIndex === -1) {
            Swal.fire("Error", "Please select a customer to update", "error");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this customer?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedCustomer = new CustomerModel(
                    $("#customerId").val(),
                    $('#customerName').val(),
                    $('#address').val(),
                    $('#contactNumber').val()
                );
                customer_db[this.selectedIndex] = updatedCustomer;
                this.loadCustomerTableData();
                this.clearForm();
                Swal.fire("Updated!", "Customer updated successfully.", "success");
            }
        });
    }

    handleDelete() {
        const customerId = $('#customerId').val();
        const index = customer_db.findIndex(item => item.customerId === customerId);

        if (index === -1) {
            Swal.fire("Not Found", "No customer found with that ID", "error");
            this.clearForm();
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this customer?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                customer_db.splice(index, 1);
                this.loadCustomerTableData();
                this.clearForm();
                Swal.fire("Deleted!", "Customer deleted successfully.", "success");
            }
        });
    }

    isDuplicated(id) {
        return customer_db.some(customer => customer.customerId === id);
    }

    setupValidation() {
        let checkId = false, checkName = false, checkAddress = false, checkNumber = false;

        const checkEmptyInputFields = () => {
            $('#customer-save').prop('disabled', !(checkId && checkName && checkAddress && checkNumber));
        };

        $('#customerId').on('input', () => {
            const id = $('#customerId').val();
            if (this.isDuplicated(id)) {
                $('#customerId').next('.error-message').text('Duplicate ID').show();
                $('#customerId').css('border', '1px solid red');
                checkId = false;
            } else if (/^C\d{3,}$/.test(id)) {
                $('#customerId').css('border', '1px solid green');
                $('#customerId').next('.error-message').hide();
                checkId = true;
            } else {
                $('#customerId').next('.error-message').text('Invalid ID Format. (Ex: C001)').show();
                $('#customerId').css('border', '1px solid red');
                checkId = false;
            }
            checkEmptyInputFields();
        });

        $('#customerName').on('input', () => {
            const name = $('#customerName').val();
            if (name.length >= 3) {
                $('#customerName').css('border', '1px solid green');
                checkName = true;
            } else {
                $('#customerName').css('border', '1px solid red');
                checkName = false;
            }
            checkEmptyInputFields();
        });

        $('#address').on('input', () => {
            const address = $('#address').val();
            if (address.length >= 5) {
                $('#address').css('border', '1px solid green');
                checkAddress = true;
            } else {
                $('#address').css('border', '1px solid red');
                checkAddress = false;
            }
            checkEmptyInputFields();
        });

        $('#contactNumber').on('input', () => {
            const number = $('#contactNumber').val();
            if (/^\d{10}$/.test(number)) {
                $('#contactNumber').css('border', '1px solid green');
                checkNumber = true;
            } else {
                $('#contactNumber').css('border', '1px solid red');
                checkNumber = false;
            }
            checkEmptyInputFields();
        });
    }

    handleSearch() {
        const keyword = $('.search-bar').val().trim().toLowerCase();
        $('#cus-body').empty();

        const results = customer_db.filter(c =>
            c.customerId.toLowerCase().includes(keyword) ||
            c.customerName.toLowerCase().includes(keyword) ||
            c.address.toLowerCase().includes(keyword) ||
            c.phoneNumber.includes(keyword)
        );

        if (results.length === 0) {
            $('#cus-body').append(`<tr><td colspan="4" class="text-danger text-center">No results found</td></tr>`);
        } else {
            results.forEach(c => {
                $('#cus-body').append(`
                    <tr>
                        <td>${c.customerId}</td>
                        <td>${c.customerName}</td>
                        <td>${c.address}</td>
                        <td>${c.phoneNumber}</td>
                    </tr>
                `);
            });
        }
    }
}

export default CustomerController;