const { quote } = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const Jimp = require("jimp");  // Importer Jimp

module.exports = {
    name: "jimp",
    category: "tool",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image"),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            // Récupérer l'image en buffer
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();

            // Charger l'image avec Jimp
            const image = await Jimp.read(buffer);

            // Appliquer un effet de netteté avec Jimp
            image.convolute([
                [ 0, -1,  0 ],
                [-1,  5, -1 ],
                [ 0, -1,  0 ]
            ]);

            // Convertir l'image traitée en buffer
            const sharpenedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

            // Envoyer l'image traitée
            return await ctx.reply({
                image: {
                    buffer: sharpenedBuffer
                },
                mimetype: mime.lookup("png")
            });

        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ une eureur c'est produite${error.message}`));
        }
    }
};
