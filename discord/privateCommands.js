//import { deregisterUser, trackTwitterAccount } from '../app.js';
import twitter from '../twitter/index.js';
import config from '../config.js';
import helperFunctions from '../helperFunctions/index.js';
import structures from '../data/structures.js'

async function followAccount(message){
    console.log("Follow Account Command");
    message.author.send("You gay");
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
    console.log("Allowing trading for user");
    message.author.send("You gay");
}

function addTwitterAccount(message){
    // `m` is a message object that will be passed through the filter function
    message.author.send('Please enter twitter username without the "@" handle. You have 30 seconds.');
    const collector = message.channel.createMessageCollector({ time: 30000 });

    collector.on('collect', async m => {
        if(m.author != '815660797236740121'){
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
                message.author.send(`Successfully tracked new twitter account`);
            } catch(error){
                console.log(error);
                message.author.send(`Error finding twitter account: ${error}`);
            }
        } catch(err){
                console.log(err);
                message.author.send(`Failed to find twitter account with username: "${m.content}"`);
            }
        }
    });

    collector.on('end', () => {
        console.log(`Twitter accounts message collector finished!`);
        message.author.send("Input time expired. Please use the command again if you wish to track more accounts");
    });
}

export default{
    followAccount,
    deregister,
    enableTrading,
    addTwitterAccount
}