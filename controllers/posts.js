// Importo gli utils
const { fs, path } = require("../utils");

// Importo i posts
let posts = require("../db/posts.json");

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

// Esporto i moduli
module.exports = {
    index
}