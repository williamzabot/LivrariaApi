const admins = [];
const customers = [];
let countAdmin = 0;
let countCustomer = 0;

function register(user, onSuccess, onFailure) {
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
            onFailure({ code: 400, message: "Tipos válidos são: admin ou customer" })
        }
        onSuccess(user)
    } else {
        onFailure({ code: 400, message: "Informações inválidas" })
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
        onFailure({ code: 404, message: "Usuário não encontrado" })
    }
}

function getAdmins() {
    return admins;
}

function getCustomers() {
    return customers;
}

module.exports = { register, getCustomer, getAdmins, getCustomers }