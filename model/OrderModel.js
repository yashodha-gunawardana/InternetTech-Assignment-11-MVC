class OrderModel {
    constructor(
        orderId,
        customerId,
        orderDate,
        total,
        discount = 0,
        subTotal,
        cash = 0,
        balance = 0
    ) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.orderDate = orderDate || new Date().toISOString().split('T')[0];
        this.total = parseFloat(total) || 0;
        this.discount = parseFloat(discount) || 0;
        this.subTotal = parseFloat(subTotal) || 0;
        this.cash = parseFloat(cash) || 0;
        this.balance = parseFloat(balance) || 0;
    }

    validate() {
        if (!this.orderId) throw new Error('Order ID is required');
        if (!this.customerId) throw new Error('Customer ID is required');
        if (this.total < 0) throw new Error('Total cannot be negative');
        if (this.discount < 0) throw new Error('Discount cannot be negative');
        if (this.subTotal < 0) throw new Error('Subtotal cannot be negative');
        if (this.cash < 0) throw new Error('Cash amount cannot be negative');

        // Validate discount doesn't exceed subtotal
        if (this.discount > this.subTotal) {
            throw new Error('Discount cannot exceed subtotal');
        }

        // Validate calculated totals
        const calculatedTotal = this.subTotal * (1 - (this.discount / 100));
        if (Math.abs(calculatedTotal - this.total) > 0.01) {
            throw new Error('Total amount calculation mismatch');
        }

        // Validate cash and balance
        const calculatedBalance = this.cash - this.total;
        if (Math.abs(calculatedBalance - this.balance) > 0.01) {
            throw new Error('Balance calculation mismatch');
        }

    }
}
export default OrderModel;