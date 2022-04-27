import twitter from '../twitter/index.js';
import config from '../config.js';
import helperFunctions from '../helperFunctions/index.js';
import structures from '../data/structures.js';
import { MessageActionRow, MessageButton } from 'discord.js';

async function followAccount(message){
    console.log(`Follow Account Command Enacted by ${message.author.username}`);

    let replyString  = `Please choose from the available twitter accounts: `;
    for(let t of structures.twitterAccounts){
        if(t.subscribedUsers.filter(user => user == message.author.id).length < 1){
            replyString += `"${t.username}", `;
        }   
    }
    replyString = replyString.slice(0, -2);
    replyString += `!`;
    message.reply(replyString);

    let filter = m => m.author != '815660797236740121';
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
            let iterator = collected.entries();
            let twitterAccountUsername = iterator.next().value[1].content;
            try{
                if(structures.twitterAccounts.filter(a => a.username === twitterAccountUsername).length > 0){
                    message.reply(`Successfully subscribed to ${twitterAccountUsername}`);
                    message.reply(`Please enter a keyword you want to look for in ${twitterAccountUsername}'s tweets!`);
                    awaitKeywords(message, filter);
                } else{
                    message.reply(`Twitter account not avaliable. Make sure there were no mistakes!`);
                    followAccount(message);
                    throw new Error('Entered username does not exist in the available twitter account list!');
                }
            } catch (err){
                console.log(err);
            }
		})
        .catch((err)  => {
            console.log(err);
        });
}

async function addKeyword(message){
    let replyString  = `Please choose which subscribed account you would like to add keywords for: "elonmusk", "smileycapital", "test66664599"!`;
    message.reply(replyString);

    let filter = m => m.author != '815660797236740121';
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
            let iterator = collected.entries();
            let string = iterator.next().value[1].content;
            try{
                if(string == 'elonmusk' || string == 'smileycapital' || string == 'test66664599'){
                    message.reply(`Collecting keyword for account ${string}. Please enter your keyword.`);
                    awaitKeywords(message, filter);
                } else{
                    message.reply(`Twitter account not avaliable. Make sure there were no mistakes!`);
                    addKeyword(message);
                    throw new Error('Entered username does not exist in the available twitter account list!');
                }
            } catch (err){
                console.log(err);
            }
		})
        .catch((err)  => {
            console.log(err);
        });
}

//helper function for followAccount and addKeywords functions
async function awaitKeywords(message, filter){
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            let iterator = collected.entries();
            let string = iterator.next().value[1].content;
            
            if(string == "stop"){
                message.reply('Interaction stopped.');
                throw new Error('User stopped keyword interaction.');
            } else{
                message.reply(`Saving keyword "${string}". If you wish to add more keywords just type another keyword, otherwise type stop or just ignore this message.`);
                awaitKeywords(message, filter);
            }
        })
        .catch((err) => {
            console.log(err);
        })
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

function notifications(message){
    let index = structures.registeredUsers.findIndex(u => { 
        return u.id === message.author.id; 
    });
    let notificationSetting = structures.registeredUsers[index].notifications;
    let label = "";
    label = notificationSetting ? 'Enable Notifications' : 'Disable Notifications';

    const row  = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(label)
            .setLabel(label)
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('Stop')
            .setLabel('Stop')
            .setStyle('DANGER'),
    );

    let content = notificationSetting ? 'Enabled' : 'Disabled'
    message.reply({ content: `Notifications are currently ${content}.\nClick on the "${label}" button to ${label} or click on "Stop" button to stop interaction.`, components: [row] })
    
    let filter = i => i.customId === label || i.customId === 'Stop' && i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        if(i.customId === label){
            structures.registeredUsers[index].notifications = notificationSetting ? false : true;
            helperFunctions.database.updateUserData(structures.registeredUsers[index]);
            await i.reply(`Changed the notification settings to ${content}`);
        } else {
            await i.reply('Interaction stopped!');
        }
    });
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
                //let res = await binance.getAccountInformation(key, secret);
                message.reply(`Successfully established connection to exchange! News Trading is now enabled.`)
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
    message.reply('Please enter twitter username without the "@" handle. You have 30 seconds.');

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
    addTwitterAccount,
    addKeyword,
    notifications
}