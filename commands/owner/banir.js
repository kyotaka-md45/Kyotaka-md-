const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "bannir",
    aliases: ["ban", "bani"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const userId = ctx.args.join(" ") || null;

        const senderJid = ctx.sender.jid;
        const senderId = senderJid.split(/[:@]/)[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : (userId ? `${userId}@s.whatsapp.net` : null);

        if (!user) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx._used, `@${senderId}`)),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(user);
            if (!result.exists) return await ctx.reply(quote(`❎ Le compte n'existe pas sur WhatsApp !`));

            await db.set(`user.${user.split("@")[0]}.banned`, true);

            await ctx.sendMessage(user, {
                text: quote(`🎉 Vous avez été banni par le propriétaire !`)
            });
            return await ctx.reply(quote(`✅ Banni avec succès !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
