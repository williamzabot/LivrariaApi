const registerRepository = require("../repositories/RegisterRepository")
const database = require("../database/DatabaseClient");
const { Client } = require("pg");

let isbnCount = 0;
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
        const values = [book.title, book.price, true]
        const response = await client.query("INSERT INTO books (titulo, preco, available) VALUES ($1, $2, $3) RETURNING *", values)
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
                bookLocate.available = false;
                const values = [bookLocate.isbn, user.customerId]
                const insertRegistration = await client.query(
                    "INSERT INTO locations (isbn, cliente) VALUES ($1, $2) RETURNING *",
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

async function returnBookToLibrary(isbn, userId, onSuccess, onFailure) {
    let locationExists = false;
    if (userId && isbn) {
        const client = new Client(connection)
        await client.connect()
        const selectLocation = await client.query(
            "SELECT * FROM locations WHERE isbn=$1 AND cliente=$2", [isbn, userId]
        )
        const location = selectLocation.rows[0]
        locationExists = location != undefined
        if (locationExists) {
            const id = location.id
            await client.query(
                "DELETE FROM locations WHERE id=$1", [id]
            )
            await client.query(
                "UPDATE books SET available = true WHERE isbn = $1;", [isbn]
            )
            onSuccess()
        } else {
            onFailure({ code: 404, message: "Locação não encontrada" })
        }
        await client.end()
    } else {
        onFailure({ code: 400, message: "Informações inválidas" })
    }
}


function getDate() {
    const date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

module.exports = { registerBook, getBooks, getBook, locate, returnBookToLibrary };