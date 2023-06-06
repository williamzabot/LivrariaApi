const express = require("express");
const router = express.Router();

const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginController");
const tokenConfig = require("../authentication/TokenConfig");

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/customers/:id", tokenConfig.verifyToken, registerController.getCustomer);

module.exports = router;
