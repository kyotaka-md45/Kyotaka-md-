const { quote } = require("@mengkodingan/ckptw");

module.exports = {
    name: "profil",
    aliases: ["me", "prof", "profile"],
    category: "profil",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const senderName = ctx.sender.pushName;
            const senderJid = ctx.sender.jid;
            const senderId = senderJid.split(/[:@]/)[0];

            const userDb = await db.get(`user.${senderId}`) || {};

            // Vérifier si l'utilisateur est propriétaire
            const isOwner = tools.general.isOwner(senderId);

            // Obtenir la date d'inscription
            const registerDate = userDb?.registerDate 
                ? new Date(userDb.registerDate).toLocaleDateString("fr-FR")
                : "Inconnue";

            // Calculer le temps passé sur le bot
            const uptime = userDb?.lastActive
                ? tools.general.convertMsToDuration(Date.now() - userDb.lastActive)
                : "Inconnu";

            // Classement des utilisateurs par victoires et niveau
            const leaderboardData = Object.entries((await db.toJSON()).user)
                .map(([id, data]) => ({
                    id,
                    winGame: data.winGame || 0,
                    level: data.level || 0
                }))
                .sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const userRank = leaderboardData.findIndex(user => user.id === senderId) + 1;

            // Obtenir la photo de profil
            const profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image")
                .catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            return await ctx.reply({
                text: `${quote(`👤 *Profil de ${senderName || "Utilisateur"}*`)}\n\n` +
                    `${quote(`📛 Nom: ${senderName || "-"}`)}\n` +
                    `${quote(`🏷️ Statut: ${isOwner ? "Propriétaire" : userDb?.premium ? "Premium" : "Gratuit"}`)}\n` +
                    `${quote(`📅 Inscription: ${registerDate}`)}\n` +
                    `${quote(`⏳ Temps passé sur le bot: ${uptime}`)}\n` +
                    `${quote(`📊 Niveau: ${userDb?.level || "0"}`)}\n` +
                    `${quote(`✨ XP: ${userDb?.xp || "0"}`)}\n` +
                    `${quote(`💰 Pièces: ${isOwner || userDb?.premium ? "Illimité" : userDb?.coin || "0"}`)}\n` +
                    `${quote(`🏆 Classement: ${userRank || "-"}`)}\n` +
                    `${quote(`🎮 Parties gagnées: ${userDb?.winGame || "0"}`)}\n` +
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
            consolefy.error(`Erreur: ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue: ${error.message}`));
        }
    }
};
