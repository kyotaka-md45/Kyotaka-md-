const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const moment = require("moment-timezone");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help", "list", "listmenu", "aide" ],
    category: "general",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const { cmd } = ctx._config;
            const tag = {
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

            let text = `Salut @${ctx.sender.jid.split(/[:@]/)[0]}, voici la liste des commandes disponibles !\n` +
                "\n" +
                `${quote(`Date : ${moment.tz(config.system.timeZone).locale("fr").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${quote(`Heure : ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${quote(`Uptime : ${tools.general.convertMsToDuration(Date.now() - config.bot.readyAt)}`)}\n` +
                `${quote(`Base de données : ${config.bot.dbSize} `)}\n` +
                `${quote(``)}\n` +
                "\n" +
                `${italic("MERCI !!!!")}\n` +
                `${config.msg.readmore}\n`;

            for (const category of Object.keys(tag)) {
                const categoryCommands = Array.from(cmd.values())
                    .filter(command => command.category === category)
                    .map(command => ({
                        name: command.name,
                        aliases: command.aliases,
                        handler: command.handler || {}
                    }));

                if (categoryCommands.length > 0) {
                    text += `${bold(tag[category])}\n`;

                    categoryCommands.forEach(cmd => {
                        let handlerText = "";
                        if (cmd.handler.coin) handlerText += "";
                        if (cmd.handler.group) handlerText += "";
                        if (cmd.handler.owner) handlerText += "";
                        if (cmd.handler.premium) handlerText += "";
                        if (cmd.handler.private) handlerText += "";

                        text += quote(monospace(`${ctx._used.prefix + cmd.name} ${handlerText}`));
                        text += "\n";
                    });

                    text += "\n";
                }
            }

            text += config.msg.footer;

            const fakeText = {
                key: {
                    fromMe: false,
                    participant: "",
                    remoteJid: ""
                },
                message: {
                    extendedTextMessage: {
                        text: config.msg.note,
                        title: config.bot.name
                    }
                }
            };

            return await ctx.sendMessage(ctx.id, {
                text,
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: config.bot.thumbnail,
                        sourceUrl: config.bot.website
                    },
                    forwardingScore: 9999,
                    isForwarded: true
                },
                mentions: [ctx.sender.jid]
            }, {
                quoted: fakeText
            });
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
