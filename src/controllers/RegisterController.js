const admins = [];
const customers = [];
let count = 0


function register(req, res) {
  const user = req.body;
  if (user && user.email && user.password && user.type) {
    if (user.type == "admin") {
      user.id = count += 1
      admins.push(user);
    } else if (user.type == "customer") {
      user.leasedBooks = []
      user.id = count += 1
      customers.push(user);
    } else {
      res.status(400).json({ message: "Tipos válidos são: admin ou customer "})
    }
    res.status(201).json(user);
  } else {
    res.status(400).json({ message: "Informações inválidas" });
  }
}

function getAdmins() {
    return admins
}

function getCustomers() {
    return customers
}

module.exports = { register, getAdmins, getCustomers };
