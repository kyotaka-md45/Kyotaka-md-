const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtube",
    aliases: ["ytb", "ytv", "yt"],
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
            const apiUrl = tools.api.createUrl("https://ytdl.axeel.my.id", "/api/download/video", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                video: {
                    url: data.downloads.url
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Il y a une erreur : ${error.message}`));
        }
    }
};
