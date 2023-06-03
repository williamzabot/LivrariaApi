
const tokenConfig = require('../authentication/TokenConfig')

function login(req, res) {
  const body = { ...req.body };
  console.log(body)
  const email = body.email;
  const password = body.password;
  if (email == "emailCorreto@mail.com" && password == "123") {
    const token = tokenConfig.generateToken({
        "email": email,
        "password": password
    });
    res.status(200).json({ token: token });
  } else {
    res.status(401).json({ "message": "email ou senha inválidos" });
  }
}

module.exports = { login };
