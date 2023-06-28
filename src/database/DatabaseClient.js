const { Client } = require("pg")

const databaseClient = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "123456",
    database: "crud_produtos"
})

async function listar() {
    await databaseClient.connect()
    const response = await databaseClient.query("SELECT * from produtos")
    console.log(response.rows)
    await databaseClient.end()
}

module.exports = { listar }
