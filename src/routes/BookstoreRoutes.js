const express = require("express");
const router = express.Router();

const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginController");
const tokenConfig = require("../authentication/TokenConfig");
const bookController = require("../controllers/BookController");

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/customers/:id", tokenConfig.verifyToken, registerController.getCustomer);
router.get("/books", tokenConfig.verifyToken, bookController.getBooks);
router.get("/books/:id", tokenConfig.verifyToken, bookController.getBook);
router.post("/books", tokenConfig.verifyToken, bookController.registerBook);
router.post("/locate", tokenConfig.verifyToken, bookController.locate);
router.post("/return/locate", tokenConfig.verifyToken, bookController.returnBookToLibrary)

module.exports = router;
