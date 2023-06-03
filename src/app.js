const PORT = 3000;

const express = require('express');
const router = require('./routes/Books');

const app = express();
app.use(express.json())

app.use('/', router);

app.listen(PORT, () => {
    console.log("Servidor iniciado...")
})

