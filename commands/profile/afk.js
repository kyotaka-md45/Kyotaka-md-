const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "profil",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        try {
            await db.set(`user.${ctx.sender.jid.split(/[:@]/)[0]}.afk`, {
                reason: input,
                timestamp: Date.now()
            });

            return await ctx.reply(quote(`📴 Vous êtes maintenant en mode AFK ${input ? `pour la raison : "${input}"` : "sans préciser de raison"}.`));
        } catch (error) {
            consolefy.error(`Erreur: ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
