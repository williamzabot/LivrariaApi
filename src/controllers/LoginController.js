const tokenConfig = require("../authentication/TokenConfig");
const registerController = require("../controllers/RegisterController");

/** Only admins can login  */
function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const admins = registerController.getAdmins();
  let userExists = false;
  admins.forEach((admin) => {
    if (admin.email == email && admin.password == password) {
      userExists = true;
      const token = tokenConfig.generateToken(admin);
      res.status(200).json({ token: token });
    }
  });
  if (!userExists) {
    res.status(400).json({ message: "Email ou senha inválidos" });
  }
}

module.exports = { login };
