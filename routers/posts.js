// Importo express
const express = require('express');

// Istanza di express.Router()
const router = express.Router();

// Controller dei posts
const postsControllers = require("../controllers/posts.js");

// Index dei Posts
router.get('/', postsControllers.index);

// Esporto l'istanza di router
module.exports = router;