// orderModel.js

class Order {
    constructor(orderId, orderDate, itemId, itemName, customerId, customerName, availableQty, orderQty, unitPrice) {
        this.orderId = orderId;               // Order ID
        this.orderDate = orderDate;           // Order Date (YYYY-MM-DD)
        this.itemId = itemId;                 // Item ID (from select)
        this.itemName = itemName;             // Item Name (text)
        this.customerId = customerId;         // Customer ID (from select)
        this.customerName = customerName;     // Customer Name (text)
        this.availableQty = availableQty;     // Available quantity of item (readonly)
        this.orderQty = orderQty;             // Quantity ordered
        this.unitPrice = unitPrice;           // Unit price of the item
    }

    // Calculate total price for the order (orderQty * unitPrice)
    getTotal() {
        return this.orderQty * this.unitPrice;
    }

    // Calculate subtotal after applying discount percentage
    static calculateSubTotal(total, discountPercent) {
        if (!discountPercent || discountPercent <= 0) return total;
        return total - (total * (discountPercent / 100));
    }

    // Calculate balance after cash payment
    static calculateBalance(subTotal, cashPaid) {
        return cashPaid - subTotal;
    }

    static generateOrderId() {
        if (!order_db.length) return 'O001'; // First order

        const maxId = order_db.reduce((max, order) => {
            const num = parseInt(order.orderId.substring(1));
            return num > max ? num : max;
        }, 0);

        return `O${(maxId + 1).toString().padStart(3, '0')}`;
    }

}

export default Order;