// Database Structure
const db = {
    users: [
        {username: "yashoda", password: "yashoda123"}
    ],
    customers: [],
    items: [],
    orders: [],
    orderDetails: [],
    currentUser: null,


    authenticate(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
    },

    addCustomer(customer) {
        if (this.customers.some(c => c.id === customer.id)) {
            throw new Error(`Customer with ID ${customer.id} already exists`);
        }
        this.customers.push(customer);
        return customer;
    },

    getCustomer(id) {
        return this.customers.find(c => c.id === id);
    },

    getAllCustomers() {
        return this.customers;
    },

    addItem(item) {
        item.id = this.generateId('I'); // Auto-generate item ID
        item.quantity = item.quantity || 0;
        this.items.push(item);
        return item;
    },

    getItem(id) {
        return this.items.find(item => item.id === id) || null;
    },

    getAllItems() {
        return this.items.map(item => ({
            ...item,
            quantity: item.quantity || 0
        }));
    },

    updateItem(item) {
        if (!item || !item.id) {
            throw new Error('Invalid item object or missing ID');
        }

        const index = this.items.findIndex(i => i.id === item.id);
        if (index === -1) {
            throw new Error(`Item with ID ${item.id} not found`);
        }

        const updatedItem = {
            ...this.items[index],
            ...item,
            quantity: parseInt(item.quantity) || 0,
            price: parseFloat(item.price) || 0
        };

        if (updatedItem.quantity < 0) {
            throw new Error('Item quantity cannot be negative');
        }

        this.items[index] = updatedItem;
        return true;
    },

    addOrder(order) {
        if (!(order instanceof OrderModel)) {
            throw new Error('Invalid order object');
        }

        order.validate(); // Custom validation from OrderModel

        if (this.orders.some(o => o.orderId === order.orderId)) {
            throw new Error(`Order ${order.orderId} already exists`);
        }

        this.orders.push(order);
        return order;
    },

    getOrder(id) {
        return this.orders.find(o => o.orderId === id);
    },

    getAllOrders() {
        return this.orders;
    },

    addOrderDetail(orderDetail) {
        if (!(orderDetail instanceof OrderDetailsModel)) {
            throw new Error('Invalid order detail object');
        }

        orderDetail.validate(); // Custom validation from OrderDetailsModel

        if (!this.orders.some(o => o.orderId === orderDetail.orderId)) {
            throw new Error(`Order ${orderDetail.orderId} does not exist`);
        }

        this.orderDetails.push(orderDetail);
        return orderDetail;
    },

    getOrderDetails(orderId) {
        return this.orderDetails.filter(od => od.orderId === orderId);
    },

    generateId(prefix) {
        const list = prefix === 'C' ? this.customers :
            prefix === 'I' ? this.items : [];
        const maxId = list.reduce((max, item) => {
            const num = parseInt(item.id.substring(1));
            return num > max ? num : max;
        }, 0);
        return `${prefix}${(maxId + 1).toString().padStart(3, '0')}`;
    }


}

export default db;