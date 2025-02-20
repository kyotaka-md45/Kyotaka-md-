// Modules et dépendances nécessaires
require("./config.js");
const handler = require("./handler.js");
const pkg = require("./package.json");
const tools = require("./tools/exports.js");
const {
    Consolefy
} = require("@mengkodingan/consolefy");
const CFonts = require("cfonts");
const fs = require("fs");
const http = require("http");
const path = require("path");
const SimplDB = require("simpl.db");

// Création de Consolefy pour l'affichage en console
const c = new Consolefy({
    tag: pkg.name
});

// Création de la base de données
const db = new SimplDB();
const dbFile = path.join(__dirname, "database.json");
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({}), "utf8");

// Configuration des variables globales
global.handler = handler;
global.config.pkg = pkg;
global.tools = tools;
global.consolefy = c;
global.db = db;

// Démarrage
c.log(`Starting...`);

// Affichage du titre avec CFonts
CFonts.say(pkg.name, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Affichage des informations sur le package
const authorName = pkg.author.name || pkg.author;
CFonts.say(
    `'${pkg.description}'\n` +
    `By ${authorName}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Fonction pour exécuter le serveur si activé
if (config.system.useServer) {
    const port = config.system.port;
    const server = http.createServer((req, res) => {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.end(`${pkg.name} is running on port ${port}`);
    });

    server.listen(port, () => {
        c.success(`Server is running at http://localhost:${port}`);
    });
}

// Importation et exécution du module principal
require("./main.js");
