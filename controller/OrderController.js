import OrderModel from '../model/OrderModel.js';
import OrderDetailsModel from '../model/OrderDetailsModel.js';
import db from '../db/db.js';

class OrderController {
    constructor() {
        this.currentOrderDetails = [];
        this.init();
    }

    init() {
        // Set current date
        document.getElementById('orderDate').valueAsDate = new Date();

        // Generate and display initial order ID
        this.generateAndDisplayOrderId();

        // Load customers and items
        this.loadCustomers();
        this.loadItems();

        // Set up event listeners
        this.setupEventListeners();
    }

    generateAndDisplayOrderId() {
        const newOrderId = db.generateOrderId();
        document.getElementById('orderId').value = newOrderId;
        return newOrderId;
    }

    loadCustomers() {
        const customers = db.getAllCustomers();
        const customerSelect = document.getElementById('customerSelect');
        customerSelect.innerHTML = '<option value="...">...</option>';

        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.id} - ${customer.name}`;
            customerSelect.appendChild(option);
        });
    }

    loadItems() {
        const items = db.getAllItems();
        const itemSelect = document.getElementById('itemSelect');
        // if (!itemSelect) return;

        itemSelect.innerHTML = '<option value="...">...</option>';

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            // option.textContent = item.id;
            option.textContent = `${item.id} - ${item.name} (${item.quantity || 0} available)`;
            option.dataset.qty = item.quantity || 0;  // Using dataset instead of setAttribute
            option.dataset.price = item.price || 0;
            itemSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        // Customer selection
        customerSelect.addEventListener('change', (e) => {
            const customer = db.getCustomer(e.target.value);
            document.querySelector('input[placeholder="Customer Name"]').value = customer?.name || '';
        });

        // Item selection
        document.getElementById('itemSelect')?.addEventListener('change', (e) => {
            this.handleItemSelection(e.target.value);
        });

        // Quantity validation
        document.getElementById('orderQuantity')?.addEventListener('input', (e) => {
            this.validateQuantityInput(e.target);
        });

        // Add button
        document.querySelector('.btn-add')?.addEventListener('click', () => this.addItemToOrder());
        // Item selection
        /* itemSelect.addEventListener('change', (e) => {
             const item = db.getItem(e.target.value);
             document.querySelector('input[placeholder="Item Name"]').value = item?.name || '';
             availableQuantity.value = item?.quantity || 0;
         });

         // Quantity validation
         document.getElementById('orderQuantity')?.addEventListener('input', (e) => {
             this.validateQuantityInput(e.target);
         });


         // Add button
         document.querySelector('.btn-add').addEventListener('click', () => this.addItemToOrder());*/

        // Remove button
        document.querySelector('.btn-remove').addEventListener('click', () => this.removeSelectedItem());

        // Update button
        document.querySelector('.btn-update').addEventListener('click', () => this.updateSelectedItem());

        // Pay button
        document.querySelector('.btn-pay').addEventListener('click', () => this.processPayment());

        // View All button
        document.querySelector('.btn-view-all').addEventListener('click', () => this.loadAllOrders());

        // Search functionality
        document.querySelector('.search-bar').addEventListener('input', (e) => {
            this.searchOrder(e.target.value);
        });

        // Discount input
        document.getElementById('discount').addEventListener('input', () => {
            this.calculateTotals();
        });

        // Cash input
        document.getElementById('cash').addEventListener('input', () => {
            this.calculateBalance();
        });

        // Reset button
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetOrderForm());
    }

    handleItemSelection(itemId) {
        if (!itemId || itemId === '...') {
            this.resetItemForm();
            return;
        }

        // Get the FRESH item data from database (not from option attributes)
        const item = db.getItem(itemId);
        if (!item) {
            console.error('Item not found in database:', itemId);
            this.resetItemForm();
            return;
        }

        // Update form fields
        document.querySelector('input[placeholder="Item Name"]').value = item.name || '';
        document.getElementById('availableQuantity').value = item.quantity || 0;

        const qtyInput = document.getElementById('orderQuantity');
        if (qtyInput) {
            qtyInput.max = item.quantity;
            qtyInput.value = '';
            qtyInput.dataset.itemId = itemId;
        }

        // Also update the selected option's data attributes
        const itemSelect = document.getElementById('itemSelect');
        const selectedOption = itemSelect?.options[itemSelect.selectedIndex];
        if (selectedOption) {
            selectedOption.dataset.qty = item.quantity;
            selectedOption.dataset.price = item.price;
            selectedOption.textContent = `${item.id} - ${item.name} (${item.quantity} available)`;
        }
    }


    validateQuantityInput(inputElement) {
        const availableQuantity = parseInt(document.getElementById('availableQuantity').value) || 0;
        const enteredQty = parseInt(inputElement.value) || 0;
        const itemId = inputElement.dataset.itemId;

        if (enteredQty <= 0) {
            inputElement.setCustomValidity('Quantity must be positive');
            return false;
        }

        if (enteredQty > availableQuantity) {
            inputElement.setCustomValidity(`Cannot exceed available quantity (${availableQuantity})`);
            return false;
        }

        // Check if item is already in order and validate total wouldn't exceed stock
        if (itemId && this.currentOrderDetails) {
            const existingInOrder = this.currentOrderDetails.find(od => od.itemId === itemId);
            if (existingInOrder) {
                const currentInOrderQty = existingInOrder.quantity;
                const item = db.getItem(itemId);
                if (item && (enteredQty + currentInOrderQty) > item.quantity) {
                    inputElement.setCustomValidity(
                        `Only ${item.quantity - currentInOrderQty} additional available`
                    );
                    return false;
                }
            }
        }

        inputElement.setCustomValidity('');
        return true;
    }


    addItemToOrder() {
        try {
            // Get form elements
            const itemSelect = document.getElementById('itemSelect');
            const quantityInput = document.getElementById('orderQuantity');
            const availableQtyInput = document.getElementById('availableQuantity');

            // Validate form elements exist
            if (!itemSelect || !quantityInput || !availableQtyInput) {
                throw new Error('Required form elements not found');
            }

            // Get and validate values
            const itemId = itemSelect.value;
            const quantity = parseInt(quantityInput.value);
            const availableQty = parseInt(availableQtyInput.value);

            if (itemId === '...' || !itemId) throw new Error('Please select a valid item');
            if (isNaN(quantity)) throw new Error('Please enter a valid quantity');
            if (quantity <= 0) throw new Error('Quantity must be greater than zero');
            if (quantity > availableQty) throw new Error(`Insufficient stock! Only ${availableQty} available.`);

            // Get fresh item data
            const item = db.getItem(itemId);
            if (!item) throw new Error('Selected item not found in database');

            // Initialize order details if needed
            if (!this.currentOrderDetails) this.currentOrderDetails = [];

            // Check for existing item in order
            const existingItemIndex = this.currentOrderDetails.findIndex(od => od.itemId === itemId);
            const orderId = document.getElementById('orderId').value;

            if (existingItemIndex >= 0) {
                // Update existing item
                const newTotalQuantity = this.currentOrderDetails[existingItemIndex].quantity + quantity;
                if (newTotalQuantity > item.quantity) {
                    throw new Error(`Cannot add ${quantity} more. Only ${item.quantity - this.currentOrderDetails[existingItemIndex].quantity} available.`);
                }

                // Create updated order detail
                const updatedDetail = new OrderDetailsModel(
                    orderId,
                    itemId,
                    item.name,
                    newTotalQuantity,
                    item.price,
                    newTotalQuantity * item.price
                );
                updatedDetail.validate();

                this.currentOrderDetails[existingItemIndex] = updatedDetail;
            } else {
                // Add new item to order
                const orderDetail = new OrderDetailsModel(
                    orderId,
                    itemId,
                    item.name,
                    quantity,
                    item.price,
                    quantity * item.price
                );
                orderDetail.validate();

                this.currentOrderDetails.push(orderDetail);
            }

            // Update UI and reset form
            this.updateOrderTable();
            this.calculateTotals();
            this.resetItemForm();
            this.loadItems(); // Refresh stock levels

            this.showSuccessMessage(`${quantity} ${item.name}(s) added to order`);
        } catch (error) {
            this.showErrorMessage(error.message);
            console.error('Error adding item to order:', error);
        }
    }

    removeSelectedItem() {
        const selectedRow = document.querySelector('#orderTableBody tr.selected');
        if (!selectedRow) {
            alert('Please select an item to remove');
            return;
        }

        const itemId = selectedRow.getAttribute('data-item-id');
        /* const quantity = parseInt(selectedRow.querySelector('td:nth-child(4)').textContent);

         // Restore stock
         const item = db.getItem(itemId);
         item.qty += quantity;
         db.updateItem(item);*/

        // Remove from order details
        this.currentOrderDetails = this.currentOrderDetails.filter(od => od.itemId !== itemId);

        this.updateOrderTable();
        this.calculateTotals();
        this.loadItems(); // Refresh item list
    }

    updateSelectedItem() {
        const selectedRow = document.querySelector('#orderTableBody tr.selected');
        if (!selectedRow) {
            alert('Please select an item to update');
            return;
        }

        const itemId = selectedRow.getAttribute('data-item-id');
        const newQuantity = parseInt(document.getElementById('orderQuantity').value);
        const availableQuantity = parseInt(document.getElementById('availableQuantity').value);
        const orderDetailIndex = this.currentOrderDetails.findIndex(od => od.itemId === itemId);
        const currentQuantity = this.currentOrderDetails[orderDetailIndex].quantity;
        const quantityDifference = newQuantity - currentQuantity;

        if (isNaN(newQuantity) || newQuantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        if (quantityDifference > availableQuantity) {
            alert(`Insufficient stock! Only ${availableQuantity} available for this change.`);
            return;
        }

        const item = db.getItem(itemId);

        // Update item quantity in database
        /* item.quantity -= quantityDifference;
         db.updateItem(item);*/

        // Update order detail
        this.currentOrderDetails[orderDetailIndex].quantity = newQuantity;
        this.currentOrderDetails[orderDetailIndex].total = newQuantity * this.currentOrderDetails[orderDetailIndex].unitPrice;

        this.updateOrderTable();
        this.calculateTotals();
        this.loadItems(); // Refresh item list
    }

    updateOrderTable() {
        const tbody = document.querySelector('#orderTableBody');
        tbody.innerHTML = '';

        const customerId = document.getElementById('customerSelect').value;
        const customer = db.getCustomer(customerId);

        this.currentOrderDetails.forEach(detail => {
            const row = document.createElement('tr');
            row.setAttribute('data-item-id', detail.itemId);

            /* row.innerHTML = `
             <td>${detail.orderId}</td>
             <td>${document.querySelector('input[placeholder="Customer Name"]').value || ''}</td>
             <td>${detail.itemName}</td>
             <td>${detail.cartQuantity}</td>
             <td>${detail.unitPrice.toFixed(2)}</td>
             <td>${detail.total.toFixed(2)}</td>

         `;*/
            row.innerHTML = `
                <td>${detail.orderId}</td>
                <td>${customer?.name || 'No customer selected'}</td>
                <td>${detail.itemName}</td>
                <td>${detail.quantity}</td>
                <td>${detail.unitPrice.toFixed(2)}</td>
                <td>${detail.total.toFixed(2)}</td>
            `;

            // Add click handler to select row
            row.addEventListener('click', () => {
                document.querySelectorAll('#orderTableBody tr').forEach(r =>
                    r.classList.remove('selected'));
                row.classList.add('selected');

                // Populate form with selected item details
                document.getElementById('itemSelect').value = detail.itemId;
                document.querySelector('input[placeholder="Item Name"]').value = detail.itemName;
                document.getElementById('orderQuantity').value = detail.quantity;

                // Get current available quantity from database
                const item = db.getItem(detail.itemId);
                document.getElementById('availableQuantity').value = item ? item.quantity : 0;
            });

            tbody.appendChild(row);
        });
    }


    calculateTotals() {
        try {
            // Calculate subtotal by summing all item totals
            const subTotal = this.currentOrderDetails.reduce((sum, item) => {
                // Ensure each item has a valid total
                if (typeof item.total !== 'number' || isNaN(item.total)) {
                    console.warn(`Invalid total for item ${item.itemId}:`, item.total);
                    return sum;
                }
                return sum + item.total;
            }, 0);

            // Get discount value safely
            let discount = parseFloat(document.getElementById('discount').value);
            if (isNaN(discount)) {
                discount = 0;
                document.getElementById('discount').value = '';
            }

            // Validate discount isn't negative
            if (discount < 0) {
                discount = 0;
                document.getElementById('discount').value = '';
                this.showErrorMessage("Discount cannot be negative");
            }

            // Calculate total after discount
            let total = subTotal;
            if (discount > 0) {
                // Apply discount (assuming discount is a percentage)
                total = subTotal * (1 - (discount / 100));
            }

            // Update UI
            document.getElementById('subTotal').value = subTotal.toFixed(2);
            document.getElementById('total').value = total.toFixed(2);

            // Recalculate balance
            this.calculateBalance();
        } catch (error) {
            console.error("Error calculating totals:", error);
            this.showErrorMessage("Error calculating order totals");
        }
    }

    calculateBalance() {
        try {
            // Get total and cash values safely
            const total = parseFloat(document.getElementById('total').value) || 0;
            let cash = parseFloat(document.getElementById('cash').value);

            // Handle invalid cash input
            if (isNaN(cash)) {
                cash = 0;
                document.getElementById('cash').value = '';
            }

            // Calculate balance
            const balance = cash - total;

            // Update UI
            document.getElementById('balance').value = balance.toFixed(2);

            // Visual feedback for balance
            const balanceField = document.getElementById('balance');
            balanceField.classList.remove('text-success', 'text-danger');

            if (balance > 0) {
                balanceField.classList.add('text-success'); // Positive balance (change due)
            } else if (balance < 0) {
                balanceField.classList.add('text-danger'); // Negative balance (amount due)
            }

            // Enable/disable Pay button based on sufficient payment
            const payButton = document.querySelector('.btn-pay');
            if (payButton) {
                payButton.disabled = balance < 0;
            }
        } catch (error) {
            console.error("Error calculating balance:", error);
            this.showErrorMessage("Error calculating payment balance");
        }
    }

    processPayment() {
        try {
            // 1. Validate customer selection
            const customerSelect = document.getElementById('customerSelect');
            const customerId = customerSelect.value;
            if (!customerId || customerId === '...') {
                throw new Error('Please select a customer before payment');
            }

            // 2. Validate items exist in order
            if (!this.currentOrderDetails || this.currentOrderDetails.length === 0) {
                // Highlight the empty order table
                const orderTable = document.querySelector('#orderTableBody');
                if (orderTable) {
                    orderTable.classList.add('border', 'border-danger');
                    setTimeout(() => orderTable.classList.remove('border', 'border-danger'), 2000);
                }
                throw new Error('Cannot process empty order. Please add items first.');
            }

            // 3. Validate payment amount
            const total = parseFloat(document.getElementById('total').value) || 0;
            const cash = parseFloat(document.getElementById('cash').value) || 0;

            if (cash < total) {
                // Highlight the cash input field
                const cashInput = document.getElementById('cash');
                cashInput.classList.add('is-invalid');
                throw new Error(`Insufficient payment. Total is $${total.toFixed(2)} but only $${cash.toFixed(2)} received.`);
            }

            // 4. Create and validate order
            const order = new OrderModel(
                document.getElementById('orderId').value,
                customerId,
                document.getElementById('orderDate').value,
                total,
                parseFloat(document.getElementById('discount').value) || 0,
                parseFloat(document.getElementById('subTotal').value) || 0,
                cash,
                cash - total
            );

            try {
                order.validate();
            } catch (validationError) {
                console.error('Order validation failed:', validationError);
                throw new Error('Invalid order data. Please try again.');
            }

            // 5. Confirm with user
            if (!confirm(`Confirm payment of $${total.toFixed(2)} for this order?`)) {
                return;
            }

            // 6. Process the order
            db.addOrder(order);

            // Process each order item
            this.currentOrderDetails.forEach(detail => {
                // Validate each detail
                try {
                    detail.validate();
                } catch (detailError) {
                    console.error('Order detail validation failed:', detailError);
                    throw new Error(`Invalid item data for ${detail.itemName}. Please try again.`);
                }

                // Check stock availability
                const item = db.getItem(detail.itemId);
                if (!item) {
                    throw new Error(`Item ${detail.itemName} not found in inventory`);
                }
                if (item.quantity < detail.quantity) {
                    throw new Error(`Insufficient stock for ${detail.itemName}. Only ${item.quantity} available`);
                }

                // Add to database and update stock
                db.addOrderDetail(detail);
                item.quantity -= detail.quantity;
                db.updateItem(item);
            });

            // 7. Success handling
            this.showSuccessMessage(`Order #${order.orderId} processed successfully!`);

            // 8. Reset for next order
            this.resetOrderForm();
            this.generateAndDisplayOrderId();

        } catch (error) {
            // Clear any previous error highlights
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

            // Show error to user
            this.showErrorMessage(error.message);
            console.error('Error processing payment:', error);

            // Optionally, log the error to server
            // this.logError(error);
        }
    }

    searchOrder(keyword) {
        const allOrders = db.getAllOrders();
        const filteredOrders = allOrders.filter(order =>
            order.id.includes(keyword) || order.customerId.includes(keyword)
        );

        const tbody = document.getElementById('orderTableBody');
        tbody.innerHTML = '';

        filteredOrders.forEach(order => {
            const customer = db.getCustomer(order.customerId);
            const orderDetails = db.getOrderDetails(order.id);

            orderDetails.forEach(detail => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${customer?.name || 'Unknown'}</td>
                    <td>${detail.itemName}</td>
                    <td>${detail.quantity}</td>
                    <td>${detail.unitPrice.toFixed(2)}</td>
                    <td>${detail.total.toFixed(2)}</td>
                `;
            });    tbody.appendChild(row);
        });
    }

    /* displaySearchResults(orders) {
         const tbody = document.getElementById('orderTableBody');
         tbody.innerHTML = '';

         orders.forEach(order => {
             const orderDetails = db.getOrderDetails(order.orderId);
             const customer = db.getCustomer(order.customerId);

             orderDetails.forEach(od => {
                 const row = document.createElement('tr');
                 row.innerHTML = `
                     <td>${od.orderId}</td>
                     <td>${customer.name}</td>
                     <td>${od.itemName}</td>
                     <td>${od.quantity}</td>
                     <td>${od.unitPrice.toFixed(2)}</td>
                     <td>${od.total.toFixed(2)}</td>
                 `;
                 tbody.appendChild(row);
             });
         });
     }*/

    loadAllOrders() {
        const allOrders = db.getAllOrders();
        const tbody = document.getElementById('orderTableBody');
        tbody.innerHTML = '';

        allOrders.forEach(order => {
            const customer = db.getCustomer(order.customerId);
            const orderDetails = db.getOrderDetails(order.id);

            orderDetails.forEach(detail => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${customer?.name || 'Unknown'}</td>
                    <td>${detail.itemName}</td>
                    <td>${detail.quantity}</td>
                    <td>${detail.unitPrice.toFixed(2)}</td>
                    <td>${detail.total.toFixed(2)}</td>
                `;
                tbody.appendChild(row);
            });
        });
    }

    resetItemForm() {
        document.querySelector('input[placeholder="Item Name"]').value = '';
        // document.querySelector('input[placeholder="Quantity"]').value = '';
        // document.getElementById('unitPrice').value = '';
        document.getElementById('availableQuantity').value = '';
        document.getElementById('orderQuantity').value = '';
        document.getElementById('itemSelect').value = '...';
    }

    resetOrderForm() {
        this.currentOrderDetails = [];
        document.getElementById('orderId').value = this.generateAndDisplayOrderId();
        document.getElementById('customerSelect').value = '...';
        document.querySelector('input[placeholder="Customer Name"]').value = '';
        document.getElementById('discount').value = '';
        document.getElementById('cash').value = '';
        document.getElementById('balance').value = '';
        document.getElementById('subTotal').value = '';
        document.getElementById('total').value = '';
        this.resetItemForm();
        this.updateOrderTable();
        this.loadItems();
    }

    showSuccessMessage(message) {
        alert(message);
    }

    showErrorMessage(message) {
        alert(message);
    }

}

export default OrderController;