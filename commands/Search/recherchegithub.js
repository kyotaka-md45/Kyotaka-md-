const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "recherchegithub",
    aliases: ["gh", "ghs", "github", "githubs"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/github", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map((r) =>
                `${quote(`Nom: ${r.fullName}`)}\n` +
                `${quote(`Description: ${r.description}`)}\n` +
                `${quote(`Watchers: ${r.watchers}`)}\n` +
                `${quote(`Nombre de Stargazers: ${r.stargazersCount}`)}\n` +
                `${quote(`Problèmes ouverts: ${r.openIssues}`)}\n` +
                `${quote(`Forks: ${r.forks}`)}\n` +
                `${quote(`URL: ${r.htmlUrl}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur est survenue: ${error.message}`));
        }
    }
}
