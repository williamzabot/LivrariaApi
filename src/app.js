const PORT = 3000;
const express = require("express");
const booksRoutes = require("./routes/BooksRoutes");
const authRoutes = require("./routes/AuthRoutes")

const app = express();
app.use(express.json());
app.use("/", authRoutes);
app.use("/books", booksRoutes);

app.listen(PORT, () => {
  console.log("Servidor iniciado...");
});
