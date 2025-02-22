const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "temps",
    aliases: ["temps"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        if (!config.bot.readyAt) {
            return await ctx.reply(quote("⚠️ Les données sur le temps d'activité du bot ne sont pas disponibles."));
        }

        const uptimeMs = Date.now() - config.bot.readyAt;
        const uptime = tools.general.convertMsToDuration(uptimeMs);

        return await ctx.reply(quote(`🚀 Le bot est actif depuis ${uptime}.`));
    }
};
