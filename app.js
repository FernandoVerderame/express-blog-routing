// Importo il path
const path = require("path")

// Importo express
const express = require('express');

// Inizializzo express
const app = express();

// Definisco le variabili port
const port = process.env.PORT || 3000;

// Router dei posts
const postsRouter = require("./routers/posts.js");

// Definisco la cartella public
app.use(express.static('public'));

// Rotta base
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, './welcome.html');
    res.sendFile(filePath);
});

// Indico ad express che esistono nuove rotte
app.use('/posts', postsRouter);

// Avvio il server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});