export let customer_db = [];
export let item_db = [];
export let order_db = [];
export let login_db = [
    { username: "yashoda", password: "yashoda123"}
];

export let currentUser = null;


export const authenticate = (username, password) => {
    const user = login_db.find(
        u => u.username === username && u.password === password
    );
    if (user) {
        currentUser = user;
        return true;
    }
    return false;
};


export const logout = () => {
    currentUser = null;
};
