const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used, "hikaru utada - one last kiss -i 8 -s spotify"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-i <number>": "Sélectionner un élément par son index.",
                "-s <text>": "Source pour jouer la musique (disponible : soundcloud, spotify, youtube | par défaut : youtube)."
            }))
        );

        try {
            const flag = tools.general.parseFlag(input, {
                "-i": {
                    type: "value",
                    key: "index",
                    validator: (val) => !isNaN(val) && parseInt(val) > 0,
                    parser: (val) => parseInt(val) - 1
                },
                "-s": {
                    type: "value",
                    key: "source",
                    validator: (val) => true,
                    parser: (val) => val.toLowerCase()
                }
            });

            const searchIndex = flag.index || 0;
            const query = flag.input;
            let source = flag.source || "youtube";

            if (!["soundcloud", "spotify", "youtube"].includes(source)) {
                source = "youtube";
            }

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("siputzx", "/api/s/soundcloud", {
                    query
                });
                const searchData = (await axios.get(searchApiUrl)).data.data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Titre : ${data.permalink}`)}\n` +
                    `${quote(`URL : ${data.link}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("siputzx", "/api/d/soundcloud", {
                    url: data.link
                });
                const downloadData = (await axios.get(downloadApiUrl)).data.data;

                return await ctx.reply({
                    audio: {
                        url: downloadData.url
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/search/tracks", {
                    q: query
                });
                const searchData = (await axios.get(searchApiUrl)).data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Titre : ${data.title}`)}\n` +
                    `${quote(`Artiste : Kendrick Lamar`)}\n` +  // Changement ici
                    `${quote(`URL : ${data.url}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/download/track", {
                    url: data.url
                });

                return await ctx.reply({
                    audio: {
                        url: downloadApiUrl
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "youtube") {
                const searchApiUrl = tools.api.createUrl("agatz", "/api/ytsearch", {
                    message: query
                });
                const searchData = (await axios.get(searchApiUrl)).data.data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Titre : ${data.title}`)}\n` +
                    `${quote(`Artiste : Kendrick Lamar`)}\n` +  // Changement ici
                    `${quote(`URL : ${data.url}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("https://ytdl.axeel.my.id", "/api/download/audio", {
                    url: data.url
                });
                const downloadData = (await axios.get(downloadApiUrl)).data;

                return await ctx.reply({
                    audio: {
                        url: downloadData.downloads.url
                    },
                    mimetype: mime.lookup("mp3")
                });
            }
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
