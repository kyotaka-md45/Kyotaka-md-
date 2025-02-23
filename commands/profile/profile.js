const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "profil",  // Nom de la commande en français
    aliases: ["moi", "prof", "profile"],  // Aliases en français
    category: "profil",  // Catégorie en français
    permissions: {},
    code: async (ctx) => {
        try {
            const senderName = ctx.sender.pushName;
            const senderJid = ctx.sender.jid;
            const senderId = tools.general.getID(senderJid);

            const userDb = await db.get(`user.${senderId}`) || {};

            const isOwner = tools.general.isOwner(senderId);

            const leaderboardData = Object.entries((await db.toJSON()).user)
                .map(([id, data]) => ({
                    id,
                    winGame: data.winGame || 0,
                    level: data.level || 0
                }))
                .sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userRank = leaderboardData.findIndex(user => user.id === senderId) + 1;

            const profilePictureUrl = await ctx.core.profilePictureUrl(senderJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            return await ctx.reply({
                text: `${quote(`Nom : ${senderName || "-"}`)}\n` +
                    `${quote(`Statut : ${isOwner ? "Propriétaire" : userDb?.premium ? "Premium" : "Freemium" || "-"}`)}\n` +
                    `${quote(`Niveau : ${userDb?.level || "-"}`)}\n` +
                    `${quote(`XP : ${userDb?.xp || "-"}`)}\n` +
                    `${quote(`Koin : ${isOwner || userDb?.premium ? "Illimités" : userDb?.coin || "-"}`)}\n` +
                    `${quote(`Rang : ${userRank || "-"}`)}\n` +
                    `${quote(`Victoires : ${userDb?.winGame || "-"}`)}\n` +
                    "\n" +
                    config.msg.footer,
                contextInfo: {
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profilePictureUrl,
                        sourceUrl: config.bot.website
                    }
                }
            });
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};.
