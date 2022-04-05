import twitter from '../twitter/index.js';
import config from '../config.js';
import helperFunctions from '../helperFunctions/index.js';
import structures from '../data/structures.js';
import binance from '../binance/index.js';

async function followAccount(message){
    console.log("Follow Account Command");
    message.author.send("Response");
}

function deregister(message){
    let index = structures.discordUsers.indexOf(message.author);
    if (index > -1){
        console.log("Deregistering user");
        structures.discordUsers.splice(index, 1);
        structures.registeredUsers.splice(index, 1);
        helperFunctions.database.deregisterUser(message.author);
        message.author.send(`You have succesfully deregistered from the bot. We're sad to see you go!`);
      }
}

async function enableTrading(message){
    console.log(`Allowing trading for user ${message.author.username}`);

    message.author.send(`Generate you API key with setting "Trading" allowed\nPlease enter your API data. Enter API key first.`);
    let filter = m => m.author != '815660797236740121';
    let key, secret;

    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
            let iterator = collected.entries();
            key = iterator.next().value[1].content;

            message.reply('Now please enter your API Secret.');
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async collected => {
                let iterator = collected.entries();
                secret = iterator.next().value[1].content;
                console.log(`User entered API keys, checking validity`);
                message.reply(`Your entered API key: ${key}, and your secret: ${secret}`);
                let res = await binance.getAccountInformation(key, secret);
                console.log(res);
                console.log('Anything else here?');
            })
            .catch((err) => {
                console.log(err);
            })
            
            //let index = structures.registeredUsers.findIndex( ({id}) => id === message.channel.author.id);
            
            //helperFunctions.database.enableTrading();
		})
        .catch(() => {
            console.log(`User interaction finished`);
        });
}

function addTwitterAccount(message){
    // `m` is a message object that will be passed through the filter function
    message.author.send('Please enter twitter username without the "@" handle. You have 30 seconds.');

    let filter = m => m.author != '815660797236740121';
    const collector = message.channel.createMessageCollector({ filter, time: 30000 });

    collector.on('collect', async m => {
        console.log(`Colleted message with message collector. Looking for twitter user ${m.content}`);
        let user = {
            username: m.content
        };

        try{
            let account = await twitter.getUserInfo(config.twitterKeys, user);
            try{
                console.log(`Attempting to track ${account.username}`);
                if(!structures.twitterAccounts.filter(a => a.id === account.id).length > 0){
                    structures.twitterAccounts.push(account);
                    helperFunctions.database.trackTwitterAccount(account);
                  }
                  else{
                    throw new Error("Twitter Account already tracked");
                  }
                message.reply(`Successfully tracked new twitter account`);
            } catch(error){
                console.log(error);
                message.reply(`Error tracking twitter account: ${error}`);
            }
        } catch(err){
                console.log(err);
                message.reply(`Failed to find twitter account with username: "${m.content}"`);
            }
    });

    collector.on('end', () => {
        console.log(`Twitter accounts message collector finished!`);
        message.author.send("Input time expired, enter the command again for further entries.");
    });
}

export default{
    followAccount,
    deregister,
    enableTrading,
    addTwitterAccount
}