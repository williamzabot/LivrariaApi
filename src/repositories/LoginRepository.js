const tokenConfig = require("../authentication/TokenConfig");
const registerRepository = require("../repositories/RegisterRepository")

function login(email, password, onSuccess, onFailure) {
    const admins = registerRepository.getAdmins();
    let userExists = false;
    admins.forEach((admin) => {
        if (admin.email == email && admin.password == password) {
            userExists = true;
            const token = tokenConfig.generateToken(admin);
            onSuccess(token)
        }
    });
    if (!userExists) {
        onFailure({ code: 400, message: "Email ou senha inválidos" })
    }
}

module.exports = { login };