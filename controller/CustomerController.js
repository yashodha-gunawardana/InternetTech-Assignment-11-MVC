import { customer_db } from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

class CustomerController {
    constructor() {
        this.selectedIndex = -1;
        this.initialize();
    }

    initialize() {
        this.bindEvents();
        this.loadCustomerTableData();
        this.setupValidation();
    }


}

export default CustomerController;