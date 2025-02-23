const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "dream",
    category: "ai-image",
    permissions: {
        coin: 10 // Coût en coins pour utiliser la commande
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        // Si l'utilisateur n'a pas fourni de texte, renvoyer des instructions et un exemple de commande
        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "moon"))
        );

        try {
            // Appel à l'API Dreamshaper pour générer l'image en fonction du prompt
            const apiUrl = tools.api.createUrl("siputzx", "/api/ai/dreamshaper", {
                prompt: input
            });

            // Répond avec l'image générée, le type MIME et une légende contenant le prompt
            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    "\n" +
                    config.msg.footer // Ajoute un pied de page à la réponse
            });
        } catch (error) {
            consolefy.error(`Erreur : ${error}`);
            // Si l'API ne répond pas correctement, renvoyer un message d'erreur
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Une erreur s'est produite : ${error.message}`));
        }
    }
};
