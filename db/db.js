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



}

export default db;