const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

const session = new Map();

module.exports = {
    name: "devinette",
    category: "game",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        if (session.has(ctx.id)) return await ctx.reply(quote(`🎮 Une partie est déjà en cours !`));

        try {
            // Utilisation d'un fichier JSON contenant des devinettes françaises
            const apiUrl = tools.api.createUrl("monapi", "/api/games/devinettes");
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const game = {
                coin: 5,
                timeout: 60000,
                senderId: ctx.sender.jid.split(/[:@]/)[0],
                answer: data.reponse.toUpperCase()
            };

            session.set(ctx.id, true);

            await ctx.reply(
                `${quote(`🧠 Devinette : ${data.question}`)}\n` +
                `${quote(`💰 Récompense : ${game.coin} pièces`)}\n` +
                `${quote(`⏳ Temps limite : ${game.timeout / 1000} secondes`)}\n` +
                `${quote("💡 Tape 'indice' pour un indice.")}\n` +
                `${quote("🏳️ Tape 'abandon' pour arrêter la partie.")}\n` +
                "\n" +
                config.msg.footer
            );

            const collector = ctx.MessageCollector({
                time: game.timeout
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.toUpperCase();

                if (userAnswer === game.answer) {
                    session.delete(ctx.id);
                    await Promise.all([
                        await db.add(`user.${game.senderId}.coin`, game.coin),
                        await db.add(`user.${game.senderId}.winGame`, 1)
                    ]);
                    await ctx.sendMessage(
                        ctx.id, {
                            text: `${quote("🎉 Bravo, c'est la bonne réponse !")}\n` +
                                `${quote(data.explication)}\n` +
                                quote(`+${game.coin} pièces`)
                        }, {
                            quoted: m
                        }
                    );
                    return collector.stop();
                } else if (userAnswer === "INDICE") {
                    const clue = game.answer.replace(/[AEIOUY]/g, "_");
                    await ctx.sendMessage(ctx.id, {
                        text: monospace(clue)
                    }, {
                        quoted: m
                    });
                } else if (userAnswer === "ABANDON") {
                    session.delete(ctx.id);
                    await ctx.reply(
                        `${quote("🏳️ Vous avez abandonné !")}\n` +
                        quote(`La réponse était : ${game.answer}.`)
                    );
                    return collector.stop();
                }
            });

            collector.on("end", async () => {
                const description = data.explication;

                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    return await ctx.reply(
                        `${quote("⏱ Temps écoulé !")}\n` +
                        `${quote(`La réponse était : ${game.answer}.`)}\n` +
                        quote(description)
                    );
                }
            });
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
