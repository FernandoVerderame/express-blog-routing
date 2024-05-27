// Importo gli utils
const { fs, path } = require("../utils");

// Importo i posts
let posts = require("../db/posts.json");

// Index dei Posts
const index = (req, res) => {

    // Content negotiation
    res.format({
        html: () => {
            // Logica HTML
            let html = '<ul>';
            posts.forEach(({ title, content, image, tags }) => {
                html += `
                <li>
                    <div>
                        <h3>${title}</h3>
                        <img width="300" height="200" src="/${image}" alt="${title}"/>
                        <p>${content}</p>
                        <p>${tags.map(t => `<strong><span class="tag">#${t}<span></strong>`).join(' ')}</p>
                    </div>
                </li>
                `
            });
            html += '</ul>';
            res.send(html);
        },
        json: () => {
            // Logica JSON
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

    //Logica HTML
    res.format({
        html: () => {
            if (requestPost) {
                const p = requestPost;
                res.send(`
                    <div>
                        <h3>${p.title}</h3>
                        <img width="300" height="200" src="/${p.image}" alt="${p.title}"/>
                        <p>${p.content}</p>
                        <p>${p.tags.map(t => `<strong><span class="tag">#${t}<span></strong>`).join(' ')}</p>
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
                    image_url: `http://${req.headers.host}/${requestPost.image}`
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

// Esporto i moduli
module.exports = {
    index,
    show
}