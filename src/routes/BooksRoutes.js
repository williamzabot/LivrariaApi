const express = require("express");
const router = express.Router();

const bookController = require("../controllers/BookController");
const tokenConfig = require("../authentication/TokenConfig");

router.get("/", tokenConfig.verifyToken, bookController.getBooks);
router.get("/:id", tokenConfig.verifyToken, bookController.getBook);
router.post("/", tokenConfig.verifyToken, bookController.registerBook);
router.post("/locate", tokenConfig.verifyToken, bookController.locate);
router.post("/return", tokenConfig.verifyToken, bookController.returnBookToLibrary)

module.exports = router;
