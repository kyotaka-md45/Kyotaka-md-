const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "facebookdl",
    aliases: ["facebook", "fb", "fbdl"],
    category: "downloader",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("https://fbdown.vercel.app", "/api/get", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                video: {
                    url: data.hd || data.sd
                },
                mimetype: mime.lookup("mp4"),
                caption: `${quote(`URL : ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            if (error.status !== 200) return ctx.reply(config.msg.notFound);
            return ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
