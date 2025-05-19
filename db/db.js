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


}