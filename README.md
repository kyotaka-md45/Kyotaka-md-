# un nouveau bot WhatsApp 
#// commands/test/helloworld.js

module.exports = { 
    name: "helloworld", 
    category: "test",
    handler: { 
        admin: Boolean, 
        botAdmin: Boolean, 
        coin: Number, 
        group: Boolean, 
        owner: Boolean, 
        premium: Boolean, 
        private: Boolean 
    },
    code: async (ctx) => { 
        if (await handler(ctx, module.exports.handler)) return; 

        return await ctx.reply("Hello, World!"); 
    }
};
