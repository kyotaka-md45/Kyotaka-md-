const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "about",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        return await ctx.reply(quote(`👋 Salut ! Je suis un bot WhatsApp nommé ${config.bot.name}, appartenant à ${config.owner.name}. Je peux exécuter de nombreuses commandes, comme créer des stickers, utiliser l'IA pour certaines tâches et d'autres commandes utiles. Je suis là pour vous divertir et vous aider !`)); // Peut être modifié selon vos préférences
    }
};
