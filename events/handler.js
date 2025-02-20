const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    Events
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const {
    exec
} = require("child_process");
const fs = require("fs");
const util = require("util");

// Gestion des événements utilisateur (arrivée/départ dans un groupe)
async function handleUserEvent(bot, m, type) {
    const {
        id,
        participants
    } = m;

    try {
        const groupId = id.split("@")[0];
        const groupDb = await db.get(`group.${groupId}`) || {};

        if (groupDb?.option?.welcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                const profilePictureUrl = await bot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

                const customText = type === "UserJoin" ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
                const userTag = `@${jid.split("@")[0]}`;

                const text = customText ?
                    customText
                    .replace(/%tag%/g, userTag)
                    .replace(/%subject%/g, metadata.subject)
                    .replace(/%description%/g, metadata.description) :
                    (type === "UserJoin" ?
                        quote(`👋 Bienvenue ${userTag} dans le groupe ${metadata.subject} !`) :
                        quote(`👋 ${userTag} a quitté le groupe ${metadata.subject}.`));

                await bot.core.sendMessage(id, {
                    text,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: config.bot.website,
                            title: config.msg.watermark,
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: profilePictureUrl || config.bot.thumbnail,
                            sourceUrl: config.bot.website
                        }
                    }
                });

                if (type === "UserJoin" && groupDb?.text?.intro) await bot.core.sendMessage(id, {
                    text: groupDb?.text?.intro,
                    mentions: [jid]
                });
            }
        }
    } catch (error) {
        consolefy.error(`Erreur : ${error}`);
        await bot.core.sendMessage(id, {
            text: quote(`⚠️ Une erreur est survenue : ${error.message}`)
        });
    }
}

module.exports = (bot) => {
    // Gestion de l'événement lorsque le bot est prêt
    bot.ev.once(Events.ClientReady, async (m) => {
        consolefy.success(`${config.bot.name} par ${config.owner.name}, prêt sur ${m.user.id}`);

        const botRestart = await db.get("bot.restart") || {};
        if (botRestart && botRestart.jid && botRestart.timestamp) {
            const timeago = tools.general.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: quote(`✅ Redémarrage réussi ! Temps pris : ${timeago}.`),
                edit: botRestart.key
            });
            db.delete("bot.restart");
        }

        // Configuration du bot
        const id = m.user.id.split(":")[0];
        await Promise.all([
            config.bot.id = id,
            config.bot.jid = `${id}@s.whatsapp.net`,
            config.bot.readyAt = bot.readyAt
        ]);

        if (config.system.requireBotGroupMembership) {
            const code = await bot.core.groupInviteCode(config.bot.groupJid) || "FxEYZl2UyzAEI2yhaH34Ye";
            config.bot.groupLink = `https://chat.whatsapp.com/${code}`;
        }
    });

    // Gestion des événements lorsque des messages arrivent
    bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
        const isGroup = ctx.isGroup();
        const isPrivate = !isGroup;

        const senderJid = ctx.sender.jid;
        const senderId = senderJid.split(/[:@]/)[0];
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? groupJid.split("@")[0] : null;

        // Base de données utilisateur
        const userDb = await db.get(`user.${senderId}`) || {};
        const isOwner = tools.general.isOwner(senderId);
        const isPremium = userDb?.premium;

        // Mode du bot
        const botMode = await db.get("bot.mode") || "public";
        if (isPrivate && botMode === "group") return;
        if (isGroup && botMode === "private") return;
        if (!isOwner && botMode === "self") return;

        // Journalisation des messages
        if (isGroup) {
            consolefy.info(`Message reçu d'un groupe : ${groupId}, par : ${senderId}`);
        } else {
            consolefy.info(`Message reçu de : ${senderId}`);
        }

        // Gestion des commandes
        const isCmd = tools.general.isCmd(m.content, ctx._config);
        if (isCmd) {
            if (config.system.autoTypingOnCmd) await ctx.simulateTyping();

            const mean = isCmd.didyoumean;
            const prefix = isCmd.prefix;

            if (mean) await ctx.reply(quote(`❎ Mauvaise saisie, essayez ${monospace(prefix + mean)}.`));

            // Gestion du niveau et des XP
            const xpGain = 10;
            let xpToLevelUp = 100;

            let newUserXp = userDb?.xp + xpGain;

            if (newUserXp >= xpToLevelUp) {
                let newUserLevel = userDb?.level + 1;
                newUserXp -= xpToLevelUp;

                xpToLevelUp = Math.floor(xpToLevelUp * 1.2);

                if (userDb?.autolevelup) await ctx.reply({
                    text: quote(`Félicitations ! Vous avez atteint le niveau ${newUserLevel} !`),
                    contextInfo: {
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: config.bot.website,
                            title: config.msg.watermark,
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: config.bot.thumbnail,
                            sourceUrl: config.bot.website
                        }
                    }
                });

                await Promise.all([
                    db.set(`user.${senderId}.xp`, newUserXp),
                    db.set(`user.${senderId}.level`, newUserLevel)
                ]);
            } else {
                await db.set(`user.${senderId}.xp`, newUserXp);
            }
        }

        // Commandes réservées au propriétaire
        if (isOwner) {
            if (m.content.startsWith("==> ") || m.content.startsWith("=> ")) {
                const code = m.content.slice(m.content.startsWith("==> ") ? 4 : 3);

                try {
                    const result = await eval(m.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);
                    await ctx.reply(monospace(util.inspect(result)));
                } catch (error) {
                    consolefy.error(`Erreur : ${error}`);
                    await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
                }
            }

            if (m.content.startsWith("$ ")) {
                const command = m.content.slice(2);

                try {
                    const output = await util.promisify(exec)(command);
                    await ctx.reply(monospace(output.stdout || output.stderr));
                } catch (error) {
                    consolefy.error(`Erreur : ${error}`);
                    await ctx.reply(quote(`⚠️ Une erreur est survenue : ${error.message}`));
                }
            }
        }
    });

    // Gestion des événements utilisateur (arrivée/départ dans un groupe)
    bot.ev.on(Events.UserJoin, async (m) => handleUserEvent(bot, m, "UserJoin"));
    bot.ev.on(Events.UserLeave, async (m) => handleUserEvent(bot, m, "UserLeave"));
};
