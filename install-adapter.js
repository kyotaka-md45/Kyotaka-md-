// Required modules and dependencies
require("./config.js");
const { execSync } = require("child_process");

// Get authentication adapter from configuration
const { adapter } = config.bot.authAdapter;

// List of modules for each authentication adapter
const modules = {
    mysql: "baileys-mysql",
    mongodb: "baileys-mongodb",
    firebase: "baileys-firebase",
};

// Install module if adapter is found in the list
if (modules[adapter]) {
    console.log(`Installing ${adapter} module...`);
    execSync(`npm install ${modules[adapter]} --no-save`, {
        stdio: "inherit"
    });
} else {
    console.log("No database module required or adapter is not set.");
}
