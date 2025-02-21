const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ajouter",
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input || isNaN(input)) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, ctx.sender.jid.split(/[:@]/)[0]))
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = `${accountFormatted}@s.whatsapp.net`;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return await ctx.reply(quote(`❎ Ce compte n'existe pas sur WhatsApp !`));

            ctx.group().add([account]).then(async (result) => {
                const res = result[0];
                if (res.status === "403") {
                    const code = await ctx.group().inviteCode();
                    await ctx.sendMessage(res.jid, {
                        text: quote(`👋 Bonjour, j'ai essayé de vous ajouter au groupe, mais une erreur s'est produite. Pouvez-vous rejoindre vous-même ? https://chat.whatsapp.com/${code}`)
                    });
                }
            });

            return await ctx.reply(quote(`✅ Utilisateur ajouté avec succès !`));
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
