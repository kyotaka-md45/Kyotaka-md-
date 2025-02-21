const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setnom",
    category: "groupe",
    handler: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "ckptw-wabot"))
        );

        try {
            await ctx.group().updateSubject(input);

            return await ctx.reply(quote(`✅ Nom du groupe modifié avec succès !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
