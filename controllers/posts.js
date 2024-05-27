// Importo il modulo File System
const fs = require("fs");

// Importo il modulo Path
const path = require("path");

// Importo i posts
let posts = require("../db/posts.json");

// Index dei Posts
const index = (req, res) => {

    // Content negotiation
    res.format({

        // Logica HTML
        html: () => {
            let html = '<ul>';
            posts.forEach(({ title, content, image, tags, slug }) => {
                html += `
                <li>
                    <div>
                        <h3>${title}</h3>
                        <img width="300" height="200" src="/${image}" alt="${title}"/>
                        <p>${content}</p>
                        <p>${tags.map(t => `<strong><span class="tag">#${t}<span></strong>`).join(' ')}</p>
                        <a href="http://${req.headers.host}/posts/${slug}">Visualizza immagine</a>
                    </div>
                </li>
                `
            });
            html += '</ul>';
            res.send(html);
        },

        // Logica JSON
        json: () => {
            res.json({
                data: posts,
                count: posts.length
            });
        }
    });
}

// Show dei posts
const show = (req, res) => {
    // Recupero lo slug dai parametri
    const requestPostSlug = req.params.slug;

    // Provo a cercare se tra gli slug dei posts esiste una relazione
    const requestPost = posts.find(post => post.slug === requestPostSlug);


    res.format({

        //Logica HTML
        html: () => {
            if (requestPost) {
                const p = requestPost;
                res.send(`
                    <div>
                        <h3>${p.title}</h3>
                        <img width="300" height="200" src="/${p.image}" alt="${p.title}"/>
                        <p>${p.content}</p>
                        <p>${p.tags.map(t => `<strong><span class="tag">#${t}<span></strong>`).join(' ')}</p>
                        <a href="http://${req.headers.host}/${requestPost.image}">Visualizza immagine</a>
                        <a href="http://${req.headers.host}/posts/${requestPost.slug}/download">Download immagine</a>
                        <a href="http://${req.headers.host}/posts">Torna indietro</a>
                    </div>
                `);
            } else {

                // Restituisco un 404 se il post non esiste
                res.status(404).send(`<h1>Post non trovato</h1>`);
            }
        },

        // Logica JSON
        json: () => {

            // Se esiste
            if (requestPost) {
                res.json({
                    ...requestPost,
                    image_url: `http://${req.headers.host}/${requestPost.image}`,
                    image_download_url: `http://${req.headers.host}/posts/${requestPost.slug}/download`
                });
            } else {
                res.status(404).json({
                    error: 'Not Found',
                    description: `Non esiste un post con slug ${slugrequestPost}`
                });
            }
        }
    });
}

// Funzione per la creazione di un nuovo post
const create = (req, res) => {
    res.format({

        // Logica HTML
        html: () => {
            res.send('<h1>Creazione nuovo post</h1>');
        },

        // Altri casi
        default: () => {
            res.status(406).send('<h1>Not Acceptable</h1>');
        }
    });
}

// Funzione per il download delle immagini dei post
const file = (sendMethod) => {
    return (req, res) => {
        const slug = req.params.slug;
        const post = posts.find(post => post.slug === slug)

        if (!post) {
            res.status(404).send('File not found.');
            return;
        }

        const filePath = path.join(__dirname, `../public/${post.image}`);
        const extension = path.extname(filePath);
        if (extension !== '.jpeg') {
            res.status(400).send(`You are not allowed to access ${extension} files.`);
        } else if (fs.existsSync(filePath)) {
            res[sendMethod](filePath);
        }
    }
}

// Esporto i moduli
module.exports = {
    index,
    show,
    create,
    file
}