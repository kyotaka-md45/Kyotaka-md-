const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "uptime",
    aliases: ["runtime"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        // Vérification des permissions
        if (await handler(ctx, module.exports.handler)) return;

        // Calcul du temps d'activité
        const tempsActif = tools.general.convertMsToDuration(Date.now() - config.bot.readyAt);

        // Réponse du bot
        return await ctx.reply(quote(`⏳ Le bot est actif depuis : ${uptime}.`));
    }
};
