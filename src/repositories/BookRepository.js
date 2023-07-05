const registerRepository = require("../repositories/RegisterRepository")
const database = require("../database/DatabaseClient");
const { Client } = require("pg");

let isbnCount = 0;
let registerCount = 0;
const connection = database.connection


async function registerBook(book, onSuccess, onFailure) {
    if (book && book.title && book.price && book.authors) {
        book.available = true;
        book.isbn = isbnCount += 1;
        if (!book.publisher) {
            book.publisher = "";
        }
        const client = new Client(connection)
        await client.connect()
        const values = [book.isbn, book.title, book.price, true]
        const response = await client.query("INSERT INTO books (isbn, titulo, preco, available) VALUES ($1, $2, $3, $4) RETURNING *", values)
        const bookAdded = response.rows[0]
        if (bookAdded != undefined) {
            onSuccess(bookAdded)
        }
        await client.end()
    } else {
        onFailure({ code: 422, message: "Faltam informações sobre o livro" })
    }
}

async function getBooks(showBooks) {
    const client = new Client(connection)
    await client.connect()
    const response = await client.query("SELECT * from books")
    const books = response.rows
    if (books != undefined) {
        await client.end()
    }
    showBooks(books)
}

async function getBook(isbn, onSuccess, onFailure) {
    let bookExists = false;
    const client = new Client(connection)
    await client.connect()
    const response = await client.query("SELECT * FROM books WHERE isbn=$1", [isbn])
    const book = response.rows[0]
    if (book != undefined) {
        bookExists = true;
        onSuccess(book)
    }
    await client.end()
    if (!bookExists) {
        onFailure({ code: 404, message: "Livro não encontrado" })
    }
}

async function locate(isbn, userId, onSuccess, onFailure) {
    let user = {};
    let userExists = false;
    if (userId && isbn) {
        registerRepository.getCustomers().forEach((customer) => {
            if (customer.customerId == userId) {
                userExists = true;
                user = customer;
            }
        });
        if (userExists) {
            let bookExists = false;
            const client = new Client(connection)
            await client.connect()
            const selectBookByIsbn = await client.query("SELECT * FROM books WHERE isbn=$1", [isbn])
            const bookLocate = selectBookByIsbn.rows[0]
            bookExists = bookLocate != undefined
            if (bookExists) {
                const leasedBooks = user.leasedBooks;
                const id = (registerCount += 1);
                bookLocate.available = false;
                if (leasedBooks.length < 3) {
                    const values = [id, bookLocate.isbn, user.email]
                    const insertRegistration = await client.query(
                        "INSERT INTO registrations (id, isbn, cliente) VALUES ($1, $2, $3) RETURNING *",
                        values
                    )
                    const registration = insertRegistration.rows[0]
                    if (registration != undefined) {
                        await client.query(
                            "UPDATE books SET available = false WHERE isbn = $1;",
                            [isbn]
                        )
                        onSuccess(registration)
                    }
                }
            } else {
                onFailure({ code: 404, message: "Livro não encontrado" })
            }
            await client.end()
        } else {
            onFailure({ code: 404, message: "Cliente não encontrado" })
        }
    } else {
        onFailure({ code: 400, message: "Faltam informações sobre a locação" })
    }
}

function returnBookToLibrary(isbn, userId, onSuccess, onFailure) {
    let bookExists = false;
    if (userId && isbn) {
        registerRepository.getCustomers().forEach((customer) => {
            if (customer.customerId == userId) {
                const leasedBooks = customer.leasedBooks;
                for (let i = 0; i < leasedBooks.length; i++) {
                    const leasedBook = leasedBooks[i];
                    if (leasedBook.isbn == isbn) {
                        bookExists = true;
                        leasedBooks.splice(i, 1);
                        leasedBook.available = true;
                        onSuccess()
                    }
                }
            }
        });
        if (!bookExists) {
            onFailure({ code: 404, message: "Livro não encontrado" })
        }
    } else {
        onFailure({ code: 400, message: "Informações inválidas" })
    }
}


function getDate() {
    const date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

module.exports = { registerBook, getBooks, getBook, locate, returnBookToLibrary };