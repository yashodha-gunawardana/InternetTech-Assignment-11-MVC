import { item_db } from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

class ItemController {
    constructor() {
        this.selectedIndex = -1;
        this.initialize();
    }

    initialize() {
        this.bindEvents();
        this.loadItemTableData();
        this.setupValidation();
    }

    bindEvents() {
        $('.btn-add').on("click", () => this.handleSave());
        $('tbody').on('click', 'tr', (e) => this.handleRowClick(e));
        $('.btn-secondary').on('click', () => this.clearForm());
        $('.btn-update').on('click', () => this.handleUpdate());
        $('.btn-remove').on('click', () => this.handleDelete());
        $('.search-bar').on('input', () => this.handleSearch());
        $('.btn-view-all').on('click', () => this.loadItemTableData());
        $('.btn-go-back').on('click', () => window.history.back());
    }

    handleSave() {
        let itemId = $("#itemId").val();
        let itemName = $('#itemName').val();
        let quantity = $('#itemQuantity').val();
        let price = $('#price').val();

        if (itemId === '' || itemName === '' || quantity === '' || price === '') {
            Swal.fire("Error!", "Invalid Inputs", "error");
            return;
        }

        if (this.isDuplicated(itemId)) {
            Swal.fire("Error!", "Duplicate Item ID!", "error");
            return;
        }

        let item = new ItemModel(itemId, itemName, parseInt(quantity), parseFloat(price));
        item_db.push(item);
        this.clearForm();
        this.loadItemTableData();

        Swal.fire("Success!", "Item Added Successfully", "success");
    }

    loadItemTableData() {
        $('tbody').empty();
        item_db.forEach(item => {
            $('tbody').append(`
                <tr>
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                </tr>
            `);
        });
    }

    handleRowClick(e) {
        this.selectedIndex = $(e.currentTarget).index();
        let item = item_db[this.selectedIndex];
        $('#itemId').val(item.itemId);
        $('#itemName').val(item.itemName);
        $('#itemQuantity').val(item.quantity);
        $('#price').val(item.price);
    }

    clearForm() {
        $('#itemId, #itemName, #itemQuantity, #price').val("");
        this.selectedIndex = -1;
    }

    handleUpdate() {
        if (this.selectedIndex === -1) {
            Swal.fire("Error", "Please select an item to update", "error");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedItem = new ItemModel(
                    $("#itemId").val(),
                    $('#itemName').val(),
                    parseInt($('#itemQuantity').val()),
                    parseFloat($('#price').val())
                );
                item_db[this.selectedIndex] = updatedItem;
                this.loadItemTableData();
                this.clearForm();
                Swal.fire("Updated!", "Item updated successfully.", "success");
            }
        });
    }

    handleDelete() {
        const itemId = $('#itemId').val();
        const index = item_db.findIndex(item => item.itemId === itemId);

        if (index === -1) {
            Swal.fire("Not Found", "No item found with that ID", "error");
            this.clearForm();
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                item_db.splice(index, 1);
                this.loadItemTableData();
                this.clearForm();
                Swal.fire("Deleted!", "Item deleted successfully.", "success");
            }
        });
    }

    isDuplicated(id) {
        return item_db.some(item => item.itemId === id);
    }

    setupValidation() {
        let checkId = false, checkName = false, checkQty = false, checkPrice = false;

        const checkEmptyFields = () => {
            $('.btn-add').prop('disabled', !(checkId && checkName && checkQty && checkPrice));
        };

        $('#itemId').on('input', () => {
            const id = $('#itemId').val();
            if (this.isDuplicated(id)) {
                $('#itemId').next('.error-message').text('Duplicate ID').show();
                $('#itemId').css('border', '1px solid red');
                checkId = false;
            } else if (/^I\d{3,}$/.test(id)) {
                $('#itemId').css('border', '1px solid green');
                $('#itemId').next('.error-message').hide();
                checkId = true;
            } else {
                $('#itemId').next('.error-message').text('Invalid ID Format. (Ex: I001)').show();
                $('#itemId').css('border', '1px solid red');
                checkId = false;
            }
            checkEmptyFields();
        });

        $('#itemName').on('input', () => {
            const name = $('#itemName').val();
            if (/^[A-Za-z0-9\s]+$/.test(name)) {
                $('#itemName').css('border', '1px solid green');
                checkName = true;
            } else {
                $('#itemName').css('border', '1px solid red');
                checkName = false;
            }
            checkEmptyFields();
        });

        $('#itemQuantity').on('input', () => {
            const qty = $('#itemQuantity').val();
            if (/^\d+$/.test(qty) && parseInt(qty) > 0) {
                $('#itemQuantity').css('border', '1px solid green');
                checkQty = true;
            } else {
                $('#itemQuantity').css('border', '1px solid red');
                checkQty = false;
            }
            checkEmptyFields();
        });

        $('#price').on('input', () => {
            const price = $('#price').val();
            if (/^\d+(\.\d{1,2})?$/.test(price) && parseFloat(price) > 0) {
                $('#price').css('border', '1px solid green');
                checkPrice = true;
            } else {
                $('#price').css('border', '1px solid red');
                checkPrice = false;
            }
            checkEmptyFields();
        });
    }

    handleSearch() {
        const keyword = $('.search-bar').val().trim().toLowerCase();
        $('tbody').empty();

        const results = item_db.filter(item =>
            item.itemId.toLowerCase().includes(keyword) ||
            item.itemName.toLowerCase().includes(keyword) ||
            item.quantity.toString().includes(keyword) ||
            item.price.toString().includes(keyword)
        );

        if (results.length === 0) {
            $('tbody').append(`<tr><td colspan="4" class="text-danger text-center">No results found</td></tr>`);
        } else {
            results.forEach(item => {
                $('tbody').append(`
                    <tr>
                        <td>${item.itemId}</td>
                        <td>${item.itemName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                    </tr>
                `);
            });
        }
    }
}

export default ItemController;