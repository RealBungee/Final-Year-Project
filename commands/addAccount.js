import structures from '../data/structures.js';
import twitter from '../twitter/index.js';
import database from '../helperFunctions/database.js';

async function add(interaction){
    interaction.reply('Enter twitter username without "@" handle.');

    let filter = m => m.author != '815660797236740121';
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });

    collector.on('collect', async m => {
        let user = {
            username: m.content
        };

        try{
            let account = await twitter.getUserInfo(user);
            try{
                console.log(`Attempting to track ${account.username}`);
                if(!structures.twitterAccounts.filter(a => a.id === account.id).length > 0){
                    m.reply('Found twitter account, gathering timeline.');
                    let tweets = await twitter.getUserTimeline(user);
                    if(tweets != undefined){
                    account.latestTweet = tweets[0].id;
                    structures.twitterAccounts.push(account);
                    database.trackTwitterAccount(account);
                    twitter.checkForNewTweets(account);
                    } 
                  }
                  else{
                    throw new Error("Twitter Account already followed");
                  }
                m.reply(`Successfully followed new twitter account`);
            } catch(error){
                console.log(error);
                m.reply(`Error tracking twitter account: ${error}`);
            }
        } catch(err){
                console.log(err);
                m.reply(`Failed to find twitter account with username: "${m.content}"`);
            }
    });

    collector.on('end', () => {
        console.log(`Twitter accounts message collector finished!`);
    });
}

export{
    add
}