const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(user, "chave-secreta-do-token", { expiresIn: "1h" });
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "chave-secreta-do-token");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido" });
  }
}

module.exports = {
  verifyToken, generateToken
};
