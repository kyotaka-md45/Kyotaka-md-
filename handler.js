const {
    Cooldown
} = require("@mengkodingan/ckptw");

// Gestion des options spéciales
async function handler(ctx, options) {
    const isGroup = ctx.isGroup(); // Vérifie si le message provient d'un groupe
    const isPrivate = !isGroup; // Vérifie si le message provient d'une conversation privée
    const senderJid = ctx.sender.jid; // Identifiant de l'expéditeur
    const senderId = senderJid.split(/[:@]/)[0]; // Extraction de l'ID de l'expéditeur

    const botMode = await db.get("bot.mode") || "public"; // Récupère le mode du bot (public, privé, groupe, self)
    if (isPrivate && botMode === "group") return true; // Si le bot est en mode groupe, il ignore les messages privés
    if (isGroup && botMode === "private") return true; // Si le bot est en mode privé, il ignore les messages de groupe
    if (!tools.general.isOwner(senderId, true) && botMode === "self") return true; // En mode self, seul le propriétaire peut interagir

    const isOwner = tools.general.isOwner(senderId); // Vérifie si l'expéditeur est le propriétaire du bot
    const userDb = await db.get(`user.${senderId}`) || {}; // Récupère les données de l'utilisateur

    // Vérification si l'utilisateur est banni
    if (userDb?.banned) {
        if (!userDb.lastSentMsg.banned) {
            await ctx.reply(config.msg.banned); // Envoie un message d'interdiction
            await db.set(`user.${senderId}.lastSentMsg.banned`, true);
            return true;
        } else {
            await ctx.react("🚫"); // Réagit avec une croix rouge si l'utilisateur insiste
            return true;
        }
    }

    // Vérification du cooldown (temps d'attente entre les commandes)
    const cooldown = new Cooldown(ctx, config.system.cooldown);
    if (cooldown.onCooldown && !isOwner && !userDb?.premium) {
        if (!userDb.lastSentMsg.cooldown) {
            await ctx.reply(config.msg.cooldown); // Envoie un message de cooldown actif
            await db.set(`user.${senderId}.lastSentMsg.cooldown`, true);
            return true;
        } else {
            await ctx.react("💤"); // Réagit avec un emoji de sommeil si l'utilisateur insiste
            return true;
        }
    }

    // Vérification de l'adhésion obligatoire au groupe du bot
    if (config.system.requireBotGroupMembership && ctx._used.command !== "botgroup" && !isOwner && !userDb?.premium) {
        const botGroupMembersId = (await ctx.group()(config.bot.groupJid).members()).map(member => member.id.split("@")[0]);
        if (!botGroupMembersId.includes(senderId)) {
            if (!userDb.lastSentMsg.requireBotGroupMembership) {
                await ctx.reply(config.msg.botGroupMembership); // Envoie un message demandant l'adhésion au groupe du bot
                await db.set(`user.${senderId}.lastSentMsg.requireBotGroupMembership`, true);
                return true;
            } else {
                await ctx.react("🚫"); // Réagit avec une croix rouge si l'utilisateur insiste
                return true;
            }
        }
    }

    // Vérification des options spéciales (admin, propriétaire, premium, etc.)
    const checkOptions = {
        admin: {
            check: async () => (await ctx.isGroup() && !await tools.general.isAdmin(ctx.group(), senderJid)), // Vérifie si l'utilisateur est admin
            msg: config.msg.admin
        },
        botAdmin: {
            check: async () => (await ctx.isGroup() && !await tools.general.isBotAdmin(ctx.group())), // Vérifie si le bot est admin
            msg: config.msg.botAdmin
        },
        coin: {
            check: async () => await checkCoin(options.coin, senderId) && config.system.useCoin, // Vérifie si l'utilisateur a assez de pièces
            msg: config.msg.coin
        },
        group: {
            check: async () => !await ctx.isGroup(), // Vérifie si la commande est exécutée en dehors d'un groupe
            msg: config.msg.group
        },
        owner: {
            check: () => !isOwner, // Vérifie si l'utilisateur est le propriétaire
            msg: config.msg.owner
        },
        premium: {
            check: () => !isOwner && !userDb?.premium, // Vérifie si l'utilisateur est premium
            msg: config.msg.premium
        },
        private: {
            check: async () => await ctx.isGroup(), // Vérifie si la commande est utilisée dans une conversation privée
            msg: config.msg.private
        },
        restrict: {
            check: () => config.system.restrict, // Vérifie si les restrictions système sont activées
            msg: config.msg.restrict
        }
    };

    // Parcours des options et exécution des vérifications
    for (const [option, { check, msg }] of Object.entries(checkOptions)) {
        if (options[option] && typeof check === "function" && await check()) {
            await ctx.reply(msg);
            return true;
        }
    }

    return false;
}

// Vérification du solde de pièces de l'utilisateur
async function checkCoin(requiredCoin, senderId) {
    const isOwner = tools.general.isOwner(senderId);
    const userDb = await db.get(`user.${senderId}`) || {};

    if (isOwner || userDb?.premium) return false; // Le propriétaire et les utilisateurs premium ne sont pas concernés

    const userCoin = userDb?.coin || 0; // Récupère le solde de l'utilisateur

    if (userCoin < requiredCoin) return true; // Si le solde est insuffisant, retourne vrai

    await db.subtract(`user.${senderId}.coin`, requiredCoin); // Déduit les pièces nécessaires
    return false;
}

module.exports = handler;
