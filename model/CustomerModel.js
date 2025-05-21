class CustomerModel {
    constructor(db) {
        this.db = db;
    }

    // Create a new customer with validation and optional manual ID
    create(data, id = null) {
        this.validateCustomerData(data);

        const customer = {
            id: id || this.db.generateId('C'), // Use provided ID or generate one
            name: data.name.trim(),
            address: data.address.trim(),
            contactNumber: data.contactNumber.trim()
        };

        // Prevent duplicate manual ID
        if (id && this.findById(id)) {
            throw new Error(`Customer ID ${id} already exists!`);
        }

        return this.db.addCustomer(customer); // Add customer to database
    }

    // Fetch all customers from database
    findAll() {
        return [...this.db.customers];
    }

    // Find a customer by ID
    findById(id) {
        return this.db.customers.find(c => c.id === id) || null;
    }

    // Update an existing customer
    update(id, data) {
        const customer = this.findById(id);
        if (!customer) return null;

        // 🔎 Validate contact number if provided
        if (data.contactNumber) {
            this.validateContactNumber(data.contactNumber);
        }

        // Update fields if new values provided
        customer.name = data.name?.trim() || customer.name;
        customer.address = data.address?.trim() || customer.address;
        customer.contactNumber = data.contactNumber?.trim() || customer.contactNumber;

        return customer; // Return updated customer
    }

    // Delete customer by ID
    delete(id) {
        const index = this.db.customers.findIndex(c => c.id === id);
        if (index === -1) return null;
        return this.db.customers.splice(index, 1)[0]; // 🗑 Remove from array
    }

    // Search for customer by ID, name, or contact number
    search(query) {
        const q = query.toLowerCase().trim();
        return this.db.customers.filter(c =>
            c.id.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.contactNumber.includes(q)
        );
    }

    // Validate required fields and contact number format
    validateCustomerData(data) {
        if (!data.name || !data.address || !data.contactNumber) {
            throw new Error('All fields are required');
        }
        this.validateContactNumber(data.contactNumber);
    }

    // Check if contact number matches format 07XXXXXXXX
    validateContactNumber(contactNumber) {
        if (!/^0[0-9]{9}$/.test(contactNumber)) {
            throw new Error('Invalid contact number format (07XXXXXXXX)');
        }
    }
}

export default CustomerModel;
