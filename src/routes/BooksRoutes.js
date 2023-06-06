const express = require("express");
const router = express.Router();

const bookController = require("../controllers/BookController");
const tokenConfig = require("../authentication/TokenConfig");
router.use(tokenConfig.verifyToken)

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBook);
router.post("/", bookController.registerBook);
router.post("/locate", bookController.locate);
router.post("/return", bookController.returnBookToLibrary)

module.exports = router;
