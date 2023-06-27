const admins = [];
const customers = [];
let countAdmin = 0;
let countCustomer = 0;

function register(user, onSuccess, invalidType, onFailure) {
    if (user && user.email && user.type) {
        if (user.type == "admin" && user.password) {
            user.id = countAdmin += 1;
            admins.push(user);
        } else if (user.type == "customer") {
            delete user.password
            user.leasedBooks = [];
            user.customerId = countCustomer += 1;
            customers.push(user);
        } else {
            invalidType()
        }
        onSuccess(user)
    } else {
        onFailure()
    }
}

function getCustomer(id, onSuccess, onFailure) {
    let customerExists = false;
    customers.forEach((customer) => {
        if (customer.customerId == id) {
            customerExists = true;
            onSuccess(customer)
        }
    });
    if (!customerExists) {
        onFailure()
    }
}

function getAdmins() {
    return admins;
}

function getCustomers() {
    return customers;
}

module.exports = { register, getCustomer, getAdmins, getCustomers }