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


}

export default OrderModel;