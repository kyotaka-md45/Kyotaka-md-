const { quote } = require("@mengkodingan/ckptw");

// Fonction pour générer le message d'information sur le bot
const getBotInfo = () => {
    return `🤖 *Informations sur le bot*  
        
📌 *Nom* : ${config.bot.name}  
👤 *Propriétaire* : ${config.owner.name} (Pharouk)  
🛠️ *Version* : v${pkg.version}  
🚀 *Statut* : Actif depuis ${tools.general.convertMsToDuration(Date.now() - config.bot.readyAt)}  

📢 Tape *.aide* pour voir toutes mes commandes !`;
};

module.exports = {
    name: "infos",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        return await ctx.reply(quote(getBotInfo()));
    }
};
