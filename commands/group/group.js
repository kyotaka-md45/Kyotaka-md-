const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "groupe",
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used, "ouvrir"))}\n` +
            quote(tools.msg.generateNotes([`Tapez ${monospace(`${ctx._used.prefix + ctx._used.command} liste`)} pour voir la liste.`]))
        );

        if (ctx.args[0] === "liste") {
            const listText = await tools.list.get("group");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "ouvrir":
                    await ctx.group().open();
                    break;
                case "fermer":
                    await ctx.group().close();
                    break;
                case "verrouiller":
                    await ctx.group().lock();
                    break;
                case "déverrouiller":
                    await ctx.group().unlock();
                    break;
                default:
                    return await ctx.reply(quote(`❎ Texte invalide !`));
            }

            return await ctx.reply(quote(`✅ Paramètres du groupe mis à jour avec succès !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
