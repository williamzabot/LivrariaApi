let count = 0;
const books = []

function registerBook(req, res) {
  const book = req.body
  if (book && book.isbn && book.title && book.price && book.authors) {
    book.id = count += 1
    book.available = true;
    if (!book.publisher) {
      book.publisher = ""
    }
    books.push(book);
    res.status(201).json(book)
  } else {
    res.status(400).json({ message: "Faltam informações sobre o livro" })
  }
}

function getBook(req, res) {
  const id = req.params.id;
  console.log(req.user);
}

module.exports = { registerBook, getBook };
