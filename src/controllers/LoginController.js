const loginRepository = require("../repositories/LoginRepository");

function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  loginRepository.login(
    email,
    password,
    (token) => {
      res.status(200).json({ token: token });
    },
    () => {
      res.status(400).json({ message: "Email ou senha inválidos" });
    },
  )
}

module.exports = { login };
