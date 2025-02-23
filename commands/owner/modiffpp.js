const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "modiffpp",
    aliases: ["modifpp", "changpp", "ajoupp"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image"),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            await ctx._client.updateProfilePicture(ctx._client.user.id, buffer);

            return await ctx.reply(quote(`✅ Image de profil du bot mise à jour avec succès !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
