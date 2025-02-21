const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "demote",
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const senderJid = ctx.sender.jid;
        const senderId = senderJid.split(/[:@]/)[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx._used, `@${senderId}`)),
            mentions: [senderJid]
        });

        try {
            if ((await !tools.general.isAdmin(ctx.group(), account))) return await ctx.reply(quote(`❎ Cet utilisateur est déjà un membre ordinaire !`));

            await ctx.group().demote([account]);

            return await ctx.reply(quote(`✅ L'utilisateur a été rétrogradé et n'est plus administrateur !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
