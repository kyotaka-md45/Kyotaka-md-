const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "taguer",
    category: "owner",
    handler: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || "Je ne sais pas quoi écrire...";

        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => {
                const serialized = m.id.split("@")[0];
                return {
                    tag: `@${serialized}`,
                    mention: m.id
                };
            });

            const mentionText = mentions.map(m => m.tag).join(" ");
            return await ctx.reply({
                text: `${input}\n` +
                    `${config.msg.readmore}─────\n` +
                    `${mentionText}`,
                mentions: mentions.map(m => m.mention)
            });
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
