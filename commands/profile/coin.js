const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "coin",  // Nom de la commande en français
    aliases: ["coin"],
    category: "profil",  // Catégorie en français
    permissions: {},
    code: async (ctx) => {
        const senderId = tools.general.getID(ctx.sender.jid);
        const userDb = await db.get(`user.${senderId}`) || {};

        // Vérifie si l'utilisateur est l'administrateur ou a un abonnement premium
        if (tools.general.isOwner(senderId) || userDb?.premium) return await ctx.reply(quote("🤑 Vous avez des koin illimités."));

        try {
            // Récupère le solde de koin de l'utilisateur
            const userCoin = await db.get(`user.${senderId}.coin`) || 0;

            return await ctx.reply(quote(`💰 Vous avez ${userCoin} koin restants.`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
