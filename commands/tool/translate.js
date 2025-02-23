const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        let input = ctx.quoted?.conversation || ctx.quoted?.extendedTextMessage?.text || Object.values(ctx.quoted || {}).find(msg => msg?.caption || msg?.text)?.caption || ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || null;
        let langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["envoyer"], ["texte"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "en bonjour, monde!"))}\n` +
            quote(tools.msg.generateNotes([`Tapez ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} pour voir la liste.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("translate");
            return await ctx.reply(listText);
        }

        try {
            const result = await tools.general.translate(input, langCode);

            return await ctx.reply(result);
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
