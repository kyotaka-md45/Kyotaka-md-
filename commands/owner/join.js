const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "join",
    aliases: ["j"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const urlCode = new URL(url).pathname.split("/").pop();
            const res = await ctx.groups.acceptInvite(urlCode);

            await ctx.sendMessage(res, {
                text: quote(`👋 Bonjour ! Je suis un bot WhatsApp nommé ${config.bot.name}, appartenant à ${config.owner.name}. Je peux exécuter de nombreuses commandes, comme créer des stickers, utiliser l'IA pour certaines tâches, et plusieurs autres commandes utiles. Je suis ici pour vous divertir et vous aider !`)
            });

            return await ctx.reply(quote(`✅ Rejoint le groupe avec succès !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
