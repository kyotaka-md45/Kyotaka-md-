const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "llama",
    category: "ia-chat",  
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "Qu'est-ce qu'un bot WhatsApp ?")) 
        );

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/ai/llama33", {
                prompt: `Tu es un bot WhatsApp nommé ${config.bot.name}, appartenant à ${config.owner.name}. Sois amical, informatif et engageant.`,
                text: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(data);
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);  
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));  
        }
    }
};
