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

    bot.user.setActivity(`STONKS`, { type: "PLAYING" });
});

bot.on('messageCreate', async (message) => {
    // ignore self messages
    if (message.author.bot) return;

    // Reply to !ping
    if (message.content.startsWith('!ping')) {
        message.channel.send("I'm working!");
    }

    async function getDoge() {
        const { data } = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=dogecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );
        message.channel.send({
            embed: {
                color: 2123412,
                title: data[0].name,
                description: "Rank #" + data[0].market_cap_rank,
                thumbnail: {
                    url: data[0].image
                },
                fields: [{
                    name: "Current",
                    value: "$" + data[0].current_price.toString()
                },{
                    name: "All time high",
                    value: "$" + data[0].ath.toString()
                }]
            }
        });
    }

    if (message.content.startsWith('!doge') && message.content.length == 5) {
        getDoge();
    }

    if (message.content.startsWith('!status') && message.content.length == 7) {
        // Get crypto price from coingecko API
        const { data } = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum%2C%20dogecoin%2C%20shiba-inu&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );
        message.channel.send({
            embed: {
                color: 2123412,
                title: "TO THE MOON!!",
                fields: [{
                    name: "-clear <#>",
                    value: "Clear a number of messages, up to 100"
                }, {
                    name: "-corona <country>",
                    value: "See coronavirus stats for a country"
                }]
            }
        });
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