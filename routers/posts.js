// Importo express
const express = require('express');

// Istanza di express.Router()
const router = express.Router();

// Controller dei posts
const postsControllers = require("../controllers/posts.js");

// Index dei Posts
router.get("/", postsControllers.index);

// Creazione di un Post
router.get("/create", postsControllers.create);

// Show dei posts
router.get("/:slug", postsControllers.show);

// Rotta per il download delle immagini
router.get("/:slug/download", postsControllers.file('download'));

// Esporto l'istanza di router
module.exports = router;