const registerRepository = require("../repositories/RegisterRepository")

function register(req, res) {
  const user = req.body;
  registerRepository.register(user,
    (user) => {
      res.status(201).json(user);
    },
    () => {
      res.status(400).json({ message: "Tipos válidos são: admin ou customer" });
    },
    () => {
      res.status(400).json({ message: "Informações inválidas" });
    }
  )
}

function getCustomer(req, res) {
  const id = req.params.id;
  registerRepository.getCustomer(id,
    (customer) => {
      res.json(customer);
    },
    () => {
      res.status(400).json({ message: "Usuário não encontrado" });
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
