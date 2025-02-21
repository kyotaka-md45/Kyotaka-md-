const { quote } = require("@mengkodingan/ckptw");
const { performance } = require("perf_hooks");

module.exports = {
    name: "ping",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            // Envoi du message "ping"
            const startTime = performance.now();
            const pingMsg = await ctx.reply("🏓 Ping...");

            // Calcul du temps de réponse
            const responseTime = (performance.now() - startTime).toFixed(2);

            // Modification du message pour afficher "pong" et le temps de réponse
            await ctx.editMessage(pingMsg.key, quote(`🏓 Pong! Temps de réponse : ${responseTime} ms.`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
