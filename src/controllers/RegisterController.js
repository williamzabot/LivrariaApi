const admins = [];
const customers = [];
let countAdmin = 0;
let countCustomer = 0;

function register(req, res) {
  const user = req.body;
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
      res
        .status(400)
        .json({ message: "Tipos válidos são: admin ou customer " });
    }
    res.status(201).json(user);
  } else {
    res.status(400).json({ message: "Informações inválidas" });
  }
}

function getCustomer(req, res) {
  const id = req.params.id;
  let customerExists = false;
  customers.forEach((customer) => {
    if (customer.customerId == id) {
      customerExists = true;
      res.json(customer);
    }
  });
  if (!customerExists) {
    res.status(400).json({ message: "Usuário não encontrado" });
  }
}


function getAdmins() {
  return admins;
}

function getCustomers() {
  return customers;
}

module.exports = { register, getAdmins, getCustomer, getCustomers };
