const { quote } = require("@mengkodingan/ckptw");
const { performance } = require("perf_hooks");

module.exports = {
    name: "ping",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const startTime = performance.now();
            const testMsg = await ctx.reply(quote("🏓 Vérification de la vitesse..."));
            const responseTime = (performance.now() - startTime).toFixed(2);
            await ctx.editMessage(testMsg.key, quote(`🏓 Pong ! Réponse en ${responseTime} ms.`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
}
