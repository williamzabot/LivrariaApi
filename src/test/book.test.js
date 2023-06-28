const bookRepository = require("../repositories/BookRepository")

const mockBook = {
  "title": "Teste",
  "price": "R$ 20,00",
  "authors": [
    {
      "name": "JK Rowling"
    }
  ],
  "publisher": "Editora Globo"
}

test("Ao registrar um livro e chamar a função getBook com o id 1, checar se ele registrou o primeiro livro corretamente", () => {
  bookRepository.registerBook(mockBook, () => { }, () => { })
  bookRepository.getBook(1,
    (book) => {
      expect(book).toBe(mockBook)
    }, () => { })
})

