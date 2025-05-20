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

}