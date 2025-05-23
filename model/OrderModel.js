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


}

export default Order;