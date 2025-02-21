const { quote } = require("@mengkodingan/ckptw");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: "serveur",
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const apiUrl = tools.api.createUrl("http://ip-api.com", "/json");

        try {
            const { data } = await axios.get(apiUrl);
            const startTime = config.bot.readyAt;

            const systemInfo = [
                `🖥️ *Système d'exploitation* : ${os.type()} (${os.arch()} / ${os.release()})`,
                `💾 *Mémoire RAM* : ${tools.general.formatSize(process.memoryUsage().rss)} / ${tools.general.formatSize(os.totalmem())}`,
                `⏳ *Uptime* : ${tools.general.convertMsToDuration(Date.now() - startTime)}`,
                `⚙️ *Processeur* : ${os.cpus()[0].model}`
            ];

            const networkInfo = Object.entries(data)
                .map(([key, value]) => `🌐 *${tools.general.ucword(key)}* : ${value}`)
                .join("\n");

            const message = [
                ...systemInfo,
                "",
                networkInfo,
                "",
                config.msg.footer
            ].map(quote).join("\n");

            return await ctx.reply(message);
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
        }
    }
};
