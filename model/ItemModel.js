class ItemModel {
    constructor(db) {
        this.db = db;
    }

    create(data, id = null) {
        this.validateItemData(data);

        const item = {
            id: id || this.db.generateId('I'), // Use provided ID or generate one
            name: data.name.trim(),
            quantity: parseInt(data.quantity) || 0,
            price: parseFloat(data.price) || 0.00,
            category: data.category?.trim() || 'general'
        };

        // Ensure ID is unique if manually provided
        if (id && this.findById(id)) {
            throw new Error(`Item ID ${id} already exists!`);
        }

        return this.db.addItem(item);
    }

    findAll() {
        return [...this.db.items];
    }

    findById(id) {
        return this.db.items.find(i => i.id === id) || null;
    }

    update(id, data) {
        const item = this.findById(id);
        if (!item) return null;

        item.name = data.name?.trim() || item.name;

        if (data.quantity !== undefined) {
            const quantity = parseInt(data.quantity);
            if (isNaN(quantity)) throw new Error('Quantity must be a number');
            item.quantity = quantity;
        }

        if (data.price !== undefined) {
            const price = parseFloat(data.price);
            if (isNaN(price)) throw new Error('Price must be a number');
            item.price = price;
        }

        if (data.category) {
            item.category = data.category.trim();
        }

        return item;
    }

    delete(id) {
        const index = this.db.items.findIndex(i => i.id === id);
        if (index === -1) return null;
        return this.db.items.splice(index, 1)[0];
    }

    search(query) {
        const q = query.toLowerCase().trim();
        return this.db.items.filter(i =>
            i.id.toLowerCase().includes(q) ||
            i.name.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        );
    }

    validateItemData(data) {
        if (!data.name) {
            throw new Error('Item name is required');
        }

        if (isNaN(data.quantity) || parseInt(data.quantity) < 0) {
            throw new Error("Quantity must be a non-negative number");
        }
        if (isNaN(data.price) || parseFloat(data.price) < 0) {
            throw new Error("Price must be a non-negative number");
        }

        if (parseInt(data.quantity) < 0) {
            throw new Error('Quantity cannot be negative');
        }

    }
}

export default ItemModel;