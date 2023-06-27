const registerRepository = require("../repositories/RegisterRepository")

function register(req, res) {
  const user = req.body;
  registerRepository.register(user,
    (user) => {
      res.status(201).json(user);
    },
    (error) => {
      res.status(error.code).json(error);
    }
  )
}

function getCustomer(req, res) {
  const id = req.params.id;
  registerRepository.getCustomer(id,
    (customer) => {
      res.json(customer);
    },
    (error) => {
      res.status(error.code).json(error);
    },
  )
}

function getAdmins() {
  return registerRepository.getAdmins();
}

function getCustomers() {
  return registerRepository.getCustomers();
}

module.exports = { register, getAdmins, getCustomer, getCustomers };
