const api = require("./api.js");
const { bold, italic, monospace, quote } = require("@mengkodingan/ckptw");
const axios = require("axios");

async function get(type) {
    try {
        let text = "";

        const createList = (data, formatter) =>
            `${data.map(formatter).join(`\n${quote("─────")}\n`)}\n` +
            "\n" +
            config.msg.footer;

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}))).data.data;
                text = createList(data, d =>
                    `${quote(`Livre: ${d.name} (${d.abbr})`)}\n` +
                    `${quote(`Nombre de chapitres: ${d.chapter}`)}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("https://equran.id", "/api/v2/surat", {}))).data.data;
                text = createList(data, d =>
                    `${quote(`Sourate: ${d.namaLatin} (${d.nomor})`)}\n` +
                    `${quote(`Nombre de versets: ${d.jumlahAyat}`)}`
                );
                break;
            }
            case "claim": {
                const data = [
                    "daily (Récompense quotidienne)",
                    "weekly (Récompense hebdomadaire)",
                    "monthly (Récompense mensuelle)",
                    "yearly (Récompense annuelle)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "fixdb": {
                const data = [
                    "user (Données des utilisateurs)",
                    "group (Données des groupes)",
                    "menfess (Données des messages anonymes)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "group": {
                const data = [
                    "open (Ouvrir le groupe)",
                    "close (Fermer le groupe)",
                    "lock (Verrouiller le groupe)",
                    "unlock (Déverrouiller le groupe)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "mode": {
                const data = [
                    "group (Mode groupe, ne répond que dans les discussions de groupe)",
                    "private (Mode privé, ne répond que dans les discussions privées)",
                    "public (Mode public, répond dans les groupes et en privé)",
                    "self (Mode autonome, ne répond qu'à lui-même et à son propriétaire)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "osettext": {
                const data = [
                    "donate (Variables disponibles: %tag%, %name%, %version%, %prefix%, %command%, %watermark%, %footer%, %readmore%) (Définir le texte des dons)",
                    "price (Variables disponibles: %tag%, %name%, %version%, %prefix%, %command%, %watermark%, %footer%, %readmore%) (Définir le texte des prix)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "setoption": {
                const data = [
                    "antilink (Anti-lien)",
                    "antinsfw (Anti-NSFW, comme la pornographie)",
                    "antisticker (Anti-sticker)",
                    "antitoxic (Anti-toxic, empêche le langage vulgaire)",
                    "autokick (Expulsion automatique en cas d'infraction à une règle 'anti...')",
                    "welcome (Message de bienvenue)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Niveau automatique)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Message d'au revoir, variables disponibles: %tag%, %subject%, %description%) (Définir le message d'adieu)",
                    "intro (Message d'introduction)",
                    "welcome (Message de bienvenue, variables disponibles: %tag%, %subject%, %description%) (Définir le message de bienvenue)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "translate": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/translate", {})).catch(err => err.response?.data?.available_languange)) || [];
                text = createList(data, d =>
                    `${quote(`Code: ${d.code}`)}\n` +
                    `${quote(`Langue: ${d.bahasa}`)}`
                );
                break;
            }
            case "tts": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/tts", {}))).data.available_languange;
                text = createList(data, d =>
                    `${quote(`Code: ${d.code}`)}\n` +
                    `${quote(`Langue: ${d["bahasa negara"]}`)}`
                );
                break;
            }
            default: {
                text = quote(`🚨 Type inconnu: ${type}`);
                break;
            }
        }

        return text;
    } catch (error) {
        consolefy.error(`Erreur: ${error}`);
        return null;
    }
}

module.exports = {
    get
};
