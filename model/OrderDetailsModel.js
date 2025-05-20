class OrderDetailsModel {
    constructor(
        orderId,
        itemId,
        itemName,
        quantity,
        unitPrice,
        total
    ) {
        this.orderId = orderId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = parseInt(quantity) || 0;
        this.unitPrice = parseFloat(unitPrice) || 0;
        this.total = parseFloat(total) || 0;
    }

    validate() {
        if (!this.orderId) throw new Error('Order ID is required');
        if (!this.itemId) throw new Error('Item ID is required');
        if (!this.itemName) throw new Error('Item name is required');
        if (this.quantity <= 0) throw new Error('Quantity must be positive');
        if (this.unitPrice < 0) throw new Error('Unit price cannot be negative');
        if (this.total < 0) throw new Error('Total cannot be negative');


    }

}