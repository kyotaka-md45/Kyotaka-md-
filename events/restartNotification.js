// cmds/restartNotification.js
const { quote } = require("@mengkodingan/ckptw");

module.exports = (bot) => {
    bot.ev.once("client-ready", async (m) => {
        // Envoi d'un message privé au créateur lorsque le bot est en ligne
        const ownerJid = config.owner.jid;  // Le JID du propriétaire
        if (ownerJid) {
            try {
                // Attente de 2 secondes pour éviter les erreurs dues à la rapidité de démarrage
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Envoi du message de notification au propriétaire
                await bot.core.sendMessage(ownerJid, {
                    text: quote(`✅ *${config.bot.name}* est maintenant *en ligne* et prêt à fonctionner après un redémarrage ! 🚀`)
                });
                consolefy.success(`📩 Message de redémarrage envoyé à ${ownerJid}`);
            } catch (error) {
                console.error(`❌ Erreur lors de l'envoi du message au propriétaire : ${error.message}`);
            }
        }
    });
};
