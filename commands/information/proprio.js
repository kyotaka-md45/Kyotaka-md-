const { VCardBuilder } = require("@mengkodingan/ckptw");

module.exports = {
    name: "proprio",
    aliases: ["creator", "developer"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        if (!config.owner || !config.owner.name || !config.owner.id) {
            return await ctx.reply("⚠️ Les informations du propriétaire ne sont pas disponibles.");
        }

        const vcard = new VCardBuilder()
            .setFullName(config.owner.name || "Inconnu")
            .setOrg(config.owner.organization || "Aucune organisation")
            .setNumber(config.owner.id)
            .build();

        return await ctx.reply({
            contacts: {
                displayName: config.owner.name,
                contacts: [{ vcard }]
            }
        });
    }
};
