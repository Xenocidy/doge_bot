// Required dependencies
const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Create a bot instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// on startup
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online`);
    // Get crypto price from coingecko API
    const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd`
    );

    bot.user.setActivity(`DOGE @ $${data.dogecoin.usd}`, { type: "WATCHING" });
});

bot.on('messageCreate', async (message) => {
    // ignore self messages
    if (message.author.bot) return;

    // Reply to !ping
    if (message.content.startsWith('!ping')) {
        message.channel.send("I'm working!");
    }

    // Reply to !price
    if (message.content.startsWith('!price')) {
        // Get the params
        const [command, ...args] = message.content.split(' ');

        // Check if there are two arguments present
        if (args.length !== 2) {
            return message.reply(
                'You must provide the crypto and the currency to compare with!'
            );
        } else {
            const [coin, vsCurrency] = args;
            try {
                // Get crypto price from coingecko API
                const { data } = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
                );

                // Check if data exists
                if (!data[coin][vsCurrency]) throw Error();

                return message.reply(
                    `The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`
                );
            } catch (err) {
                return message.reply(
                    'Please check your inputs. For example: !price bitcoin usd'
                );
            }
        }
    }

});

// Log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN);