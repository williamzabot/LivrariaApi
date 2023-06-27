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
    (error) => {
      res.status(error.code).json(error);
    },
  )
}

module.exports = { login };
