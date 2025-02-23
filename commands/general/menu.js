const { monospace, quote, bold } = require("@mengkodingan/ckptw");
const moment = require("moment-timezone");

module.exports = {
    name: "menu",
    aliases: ["help", "list", "aide"],
    category: "general",
    permissions: {},
    code: async (ctx) => {
        try {
            const { cmd } = ctx.bot;
            const categories = {
                "ai-chat": "IA (Chat)",
                "ai-image": "IA (Image)",
                "converter": "Convertisseur",
                "downloader": "Téléchargeur",
                "entertainment": "Divertissement",
                "game": "Jeux",
                "group": "Groupe",
                "maker": "Créateur",
                "profile": "Profil",
                "search": "Recherche",
                "tool": "Outil",
                "owner": "Propriétaire",
                "information": "Informations",
                "misc": "Divers"
            };

            const userID = ctx.sender.jid.split('@')[0];  
            const date = moment().tz(config.system.timeZone).locale("fr").format("dddd, DD MMMM YYYY");
            const time = moment().tz(config.system.timeZone).format("HH:mm:ss");
            const uptime = tools.general.convertMsToDuration(Date.now() - config.bot.readyAt);
            const platform = config.bot.platform || "Inconnue";
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Mémoire utilisée en MB
            const memory = `${Math.round(memoryUsage * 100) / 100}MB`; // Affichage arrondi à 2 décimales
            const prefix = ctx.used.prefix || "!"; 

            let responseText = `utilisateurs @${userID}\n` +
                `Nombre de plugins : ${Object.keys(categories).length}\n` +
                `Mémoire : ${memory}\n` +
                `Uptime : ${uptime}\n` +
                `Plateforme : ${platform}\n` +
                `Préfixe : ${prefix}\n\n` +
                "╭─────────────────────────────\n";

            for (const category of Object.keys(categories)) {
                const categoryCommands = Array.from(cmd.values())
                    .filter(command => command.category === category);

                if (categoryCommands.length > 0) {
                    responseText += `╭─⦿ ${bold(categories[category])}⦿\n`;
                    categoryCommands.forEach((cmd, index) => {
                        responseText += ` │ ${index + 1}. ${monospace(`${ctx.used.prefix + cmd.name}`)}\n`;
                    });
                    responseText += "╰─────────────────\n";
                }
            }

            responseText += `\n${quote("Merci de faire vivre ce bot !")}`;

            return await ctx.reply(responseText);
        } catch (error) {
            console.error(`Erreur : ${error.message}`);
            return await ctx.reply(quote(`Erreur : ${error.message}`));
        }
    }
};
