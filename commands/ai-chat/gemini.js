const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "gemini",
    category: "ai-chat",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], [ "image","text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used, "qu'est-ce qu'un bot WhatsApp ?"))}\n` +
            quote(tools.msg.generateNotes(["Cette IA peut voir des médias et répondre à des questions à leur sujet. Envoyez un média et posez n'importe quelle question !"]))
        );

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image"),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
                const uploadUrl = await tools.general.upload(buffer);
                const apiUrl = tools.api.createUrl("sandipbaruwal", "/gemini2", {
                    prompt: input,
                    url: uploadUrl
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return await ctx.reply(data.answer);
            } else {
                const apiUrl = tools.api.createUrl("sandipbaruwal", "/gemini", {
                    prompt: input
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return await ctx.reply(data.answer);
            }
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
