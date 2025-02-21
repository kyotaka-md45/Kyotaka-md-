const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tiktoknowm", "tt", "ttdl", "vt", "vtdl", "vtdltiktok", "vtnowm"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/ -a"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-a": "Envoyer automatiquement l'audio."
            }))
        );

        const flag = tools.general.parseFlag(input, {
            "-a": {
                type: "boolean",
                key: "audio"
            }
        });

        const url = flag.input || null;

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const mediaType = flag.audio ? "audio" : "video_image";

            const apiUrl = tools.api.createUrl("https://api.tiklydown.eu.org", "/api/download", {
                url
            });
            const result = (await axios.get(apiUrl)).data;

            if (mediaType === "audio") {
                return await ctx.reply({
                    audio: {
                        url: result.music.play_url
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (mediaType === "video_image") {
                if (result.video?.noWatermark) {
                    return await ctx.reply({
                        video: {
                            url: result.video.noWatermark
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: `${quote(`URL: ${url}`)}\n` +
                            "\n" +
                            config.msg.footer
                    });
                }

                if (result.images && result.images.length > 0) {
                    for (const image of result.images) {
                        await ctx.reply({
                            image: {
                                url: image.url
                            },
                            mimetype: mime.lookup("png")
                        });
                    }
                }
            }
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
