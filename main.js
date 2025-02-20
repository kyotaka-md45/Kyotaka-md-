// Required modules and dependencies
const events = require("./events/handler.js");
const { Client, CommandHandler } = require("@mengkodingan/ckptw");
const path = require("path");

// Choose authentication adapter
const authAdapter = (() => {
    const { adapter, mysql, mongodb, firebase } = config.bot.authAdapter;
    switch (adapter) {
        case "mysql":
            return require("baileys-mysql").useSqlAuthState(mysql);
        case "mongodb":
            return require("baileys-mongodb").useMongoAuthState(mongodb.url);
        case "firebase":
            return require("baileys-firebase").useFireAuthState(firebase);
        default:
            return undefined;
    }
})();

// Create a new bot instance
const bot = new Client({
    prefix: config.bot.prefix,
    readIncommingMsg: config.system.autoRead,
    printQRInTerminal: !config.system.usePairingCode,
    markOnlineOnConnect: config.system.alwaysOnline,
    phoneNumber: config.bot.phoneNumber,
    usePairingCode: config.system.usePairingCode,
    selfReply: config.system.selfReply,
    WAVersion: [2, 3000, 1015901307],
    autoMention: config.system.autoMention,
    authAdapter
});

// Handle events
events(bot);

// Create a command handler and load commands
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Launch the bot
bot.launch().catch((error) => console.error(`Error: ${error}`))
