const { quote } = require("@mengkodingan/ckptw");
const { exec } = require("child_process");
const util = require("util");

module.exports = {
    name: "restart",
    aliases: ["redémarrer"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!process.env.PM2_HOME) return await ctx.reply(quote("❎ Le bot ne tourne pas sous PM2. Un redémarrage manuel est nécessaire."));

        try {
            const waitMsg = await ctx.reply(config.msg.wait);
            await db.set(`bot.restart`, {
                jid: ctx.id,
                key: waitMsg.key,
                timestamp: Date.now()
            });

            return await util.promisify(exec)("pm2 restart $(basename $(pwd))"); // Fonctionne uniquement avec PM2
        } catch (error) {
            console.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
