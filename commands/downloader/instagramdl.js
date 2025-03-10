const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "instagramdl",
    aliases: ["ig", "igdl", "instagram","insta"],
    category: "downloader",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/igdl", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            for (const media of data) {
                const isImage = media.type === "image";
                const mediaType = isImage ? "image" : "video";
                const extension = isImage ? "png" : "mp4";

                await ctx.reply({
                    [mediaType]: {
                        url: media.url
                    },
                    mimetype: mime.lookup(extension)
                });
            }
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ une erreur c'est produite: ${errorMessage}`));
        }
    }
};
