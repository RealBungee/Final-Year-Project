import twitter from '../twitter/index.js';
import structures from '../data/structures.js';
import { MessageActionRow, MessageButton } from 'discord.js';
import database from '../helperFunctions/database.js';

async function followAccount(message){
    const rows = [new MessageActionRow()];
    const user = structures.registeredUsers.find(u => u.id == message.author.id);
    let labels = [];
    
    let rowIndex = 0;
    for(let t of structures.twitterAccounts){
        if(rows[rowIndex].components.length == 5){
            rows.push(new MessageActionRow());
            rowIndex++;
        }
        if(user.followedAccounts.get(t.username) === undefined){
            rows[rowIndex].addComponents( new MessageButton()
                    .setCustomId(t.username)
                    .setLabel(t.username)
                    .setStyle('PRIMARY'),
            );
            labels.push(t.username);
        }
    }
    if(rows[rowIndex].components.length == 5){
        rows.push(new MessageActionRow());
        rowIndex++;
    }
    rows[rowIndex].addComponents( new MessageButton()
        .setCustomId('Stop Interaction')
        .setLabel('Stop Interaction')
        .setStyle('DANGER'),
    );
    labels.push('Stop Interaction');
    
    let content  = `Please choose from the available twitter accounts: `;
    message.reply({ content, components: rows });
    
    const filter = i => i.customId === labels.find(l => l == i.customId) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });
    let account = '';

    collector.on('collect', async i => {
        if(i.customId === 'Stop Interaction'){
            await i.reply(`Interaction stopped!`);
        } else {
            account = i.customId;
            const row = new MessageActionRow()
                .addComponents( new MessageButton()
                    .setCustomId('Select keywords')
                    .setLabel('Select Keywords')
                    .setStyle('SUCCESS'))
                .addComponents( new  MessageButton()
                    .setCustomId('No Keywords')
                    .setLabel('Subscribe to All Tweets')
                    .setStyle('PRIMARY'))
                .addComponents( new MessageButton()
                    .setCustomId('Stop Interaction')
                    .setLabel('Stop Interaction')
                    .setStyle('DANGER'))
                .addComponents( new MessageButton()
                    .setCustomId('Select Another')
                    .setLabel('Select Another Account')
                    .setStyle('SECONDARY'))
            content = `You selected "${i.customId}".`
            labels = [... labels, 'Select keywords', 'No Keywords', 'Select Another'];
            i.reply({ content, components: [row]});

            const coll = message.channel.createMessageComponentCollector({ filter, time: 15000, max: 1});

            coll.on('collect', async i => {
                if(i.customId === 'Stop Interaction'){
                    await i.reply(`Interaction stopped!`);
                } else if(i.customId === 'Select keywords'){
                    i.reply('Please enter the keyword you are looking for');
                    let keywordFilter = m => m.author.id != '815660797236740121';
                    let keywords = [];
                    awaitKeywords(message, keywordFilter, account, keywords);
                } else if(i.customId === 'No Keywords'){
                    const user = structures.registeredUsers.find(u => u.id == message.author.id);
                    user.followedAccounts.set(account, []);
                    database.updateFollowedAccount(user);
                    i.reply(`Followed ${account} with no tracked keywords!`);
                }
                else{
                    followAccount(message);
                }
            });
        }
    });
}

async function unfollowAccount(message){
    const rows = [new MessageActionRow()];
    const user = structures.registeredUsers.find(u => u.id == message.author.id);
    let labels = [];
    
    let rowIndex = 0;
    for(let t of structures.twitterAccounts){
        if(rows[rowIndex].components.length == 5){
            rows.push(new MessageActionRow());
            rowIndex++;
        }
        if(user.followedAccounts.get(t.username) != undefined){
            rows[rowIndex].addComponents( new MessageButton()
                    .setCustomId(t.username)
                    .setLabel(t.username)
                    .setStyle('PRIMARY'),
            );
            labels.push(t.username);
        }
    }
    if(rows[rowIndex].components.length == 5){
        rows.push(new MessageActionRow());
        rowIndex++;
    }
    rows[rowIndex].addComponents( new MessageButton()
        .setCustomId('Stop Interaction')
        .setLabel('Stop Interaction')
        .setStyle('DANGER'),
    );
    labels.push('Stop Interaction');
    
    let content  = `Click on the account you'd like to unfollow: `;
    message.reply({ content, components: rows });

    const filter = i => i.customId === labels.find(l => l == i.customId) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async i => {
        if(i.customId === 'Stop Interaction'){
            await i.reply(`Interaction stopped!`);
        }
        
        user.followedAccounts.delete(i.customId);
        database.updateFollowedAccount(user);
        i.reply(`Successfully unfollowed ${i.customId}`);
    });
}

async function keywords(message){
    const row = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('Add Keyword')
        .setLabel('Add Keyword')
        .setStyle('SUCCESS'))
      .addComponents(new MessageButton()
        .setCustomId('List Keywords')
        .setLabel('List Keywords')
        .setStyle('PRIMARY'))
      .addComponents(new MessageButton()
        .setCustomId('Stop Interaction')
        .setLabel('Stop Interaction')
        .setStyle('DANGER'));

    const labels = ['Add Keyword',  'List Keywords', 'Stop Interaction'];
    const content = `Pick from the following options:`;
    message.reply({ content, components: [row] });

    const filter = i => i.customId == labels.find(l => l == i.customId) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({filter, time: 15000, max: 1});

    collector.on('collect', async i => {
        if(i.customId == 'Add Keyword'){
            addKeyword(message);
        } else if(i.customId == 'List Keywords'){
            pickAccount(message);
        } else{
            i.reply('Interaction Finished!');
        }
    })
}

async function pickAccount(message){
    const rows = [new MessageActionRow()];
    const user = structures.registeredUsers.find(u => u.id == message.author.id);
    let labels = [];
    let iterator = user.followedAccounts.keys();
    let result = iterator.next();
    let rowIndex = 0;

    while(!result.done){
        if(rows[rowIndex].components.length == 5){
            rows.push(new MessageActionRow());
            rowIndex++;
        }
        rows[rowIndex].addComponents( new MessageButton()
                .setCustomId(result.value)
                .setLabel(result.value)
                .setStyle('PRIMARY'),
        );
        labels.push(result.value);
        result = iterator.next();
    }
    if(rows[rowIndex].components.length == 5){
        rows.push(new MessageActionRow());
        rowIndex++;
    }
    rows[rowIndex].addComponents( new MessageButton()
        .setCustomId('Stop Interaction')
        .setLabel('Stop Interaction')
        .setStyle('DANGER'),
    );
    labels.push('Stop Interaction');

    let content  = `Choose which account you would like to list keywords for: `;
    message.reply({ content, components: rows });

    const filter = i => i.customId == labels.find(l => l == i.customId) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({filter, time: 15000, max: 1});

    collector.on('collect', async i => {
        if(i.customId == 'Stop Interaction'){
            i.reply('Interaction Finished!');
        } else {
            listKeywords(i, user, i.customId);
        }
    })
}

async function listKeywords(interaction, user, account){
    const keywords = user.followedAccounts.get(account);
    const rows = [new MessageActionRow()];
    let labels = [];
    let rowIndex = 0;

    for(let k of keywords){
        if(rows[rowIndex].components.length == 5){
            rows.push(new MessageActionRow());
            rowIndex++;
        }
        rows[rowIndex].addComponents( new MessageButton()
                .setCustomId(k)
                .setLabel(k)
                .setStyle('DANGER'),
        );
        labels.push(k);
    }
    if(rows[rowIndex].components.length == 5){
        rows.push(new MessageActionRow());
        rowIndex++;
    }
    rows[rowIndex].addComponents( new MessageButton()
        .setCustomId('Stop Interaction')
        .setLabel('Stop Interaction')
        .setStyle('SUCCESS'),
    );
    labels.push('Stop Interaction');
    let content = `Click on the keyword you would like to remove:`;
    interaction.reply({ content, components: rows});

    const filter = i => i.customId == labels.find(l => l == i.customId) && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({filter, time: 15000, max: 1});

    collector.on('collect', async i => {
        if(i.customId == 'Stop Interaction'){
            i.reply('Interaction Finished!');
        } else {
            let index = keywords.findIndex(k => k == i.customId);
            keywords.splice(index, 1);
            console.log(keywords);
            user.followedAccounts.set(account, keywords);
            database.updateFollowedAccount(user);
            listKeywords(i, user, account);
        }
    })
}

async function addKeyword(message){
    const rows = [new MessageActionRow()];
    const user = structures.registeredUsers.find(u => u.id == message.author.id);
    const iterator = user.followedAccounts.keys();
    
    let labels = [];
    let account = '';
    let rowIndex = 0;
    let content  = `Please choose one of your followed twitter accounts: `;
    let result = iterator.next();
    while(!result.done){
        if(rows[rowIndex].components.length == 5){
            rows.push(new MessageActionRow());
            index++;
        }
        rows[rowIndex].addComponents( new MessageButton()
                    .setCustomId(result.value)
                    .setLabel(result.value)
                    .setStyle('PRIMARY'),
            );
        labels.push(result.value);
        result = iterator.next();
    }

    if(rows[rowIndex].components.length == 5){
        rows.push(new MessageActionRow());
        rowIndex++;
    }
    rows[rowIndex].addComponents( new MessageButton()
        .setCustomId('Stop Interaction')
        .setLabel('Stop Interaction')
        .setStyle('DANGER'),
    );
    message.reply({ content, components: rows });

    const filter = i => i.customId === labels.find(l => l == i.customId) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async i => {
        if(i.customId === 'Stop Interaction'){
            await i.reply(`Interaction stopped!`);
        } else {
            account = i.customId;
            let keywordFilter = m => m.author.id != '815660797236740121';
            let keywords = user.followedAccounts.get(account);
            i.reply(`Collecting keywords for account ${account}. Please enter your keyword.`);
            awaitKeywords(message, keywordFilter, account, keywords);
        }
    });
}

//helper function for followAccount and addKeywords functions
async function awaitKeywords(message, filter, account, keywords){
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const keyword = collected.entries().next().value[1].content.toLowerCase();
            
            if(keyword == 'stop' && keywords.length > 0){
                const user = structures.registeredUsers.find(u => u.id == message.author.id);
                user.followedAccounts.set(account, keywords);
                database.updateFollowedAccount(user);
                message.reply('Interaction stopped.');
                return;
            }

            if(keywords.includes(keyword)) {
                message.reply(`The entered keyword has already been added. Type another or type stop.`);
            } else{
                keywords.push(keyword);
                message.reply(`Saving keyword "${keyword}". Type another keyword or type stop to stop interaction.`);
            }
            awaitKeywords(message, filter, account, keywords);
        })
        .catch((err) => { console.log(err)});
}

function deregister(m){
    const index = structures.discordUsers.indexOf(m.author);
    if (index > -1){
        database.deregisterUser(m.author);
        structures.discordUsers.splice(index, 1);
        structures.registeredUsers.splice(index, 1);
        m.author.send(`You have succesfully deregistered from the bot. We're sad to see you go!`);
      }
}

function notifications(m){
    const index = structures.registeredUsers.findIndex(u => { return u.id === m.author.id; });
    const notifications = structures.registeredUsers[index].notifications;
    const label = notifications ? 'Disable Notifications' : 'Enable Notifications';
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

    let content = notifications ? 'Enabled' : 'Disabled';
    m.reply({ content: `Notifications are currently ${content}.\nClick on the "${label}" button to ${label} or click on "Stop" button to stop interaction.`, components: [row] })
    
    const filter = i => i.customId === label || i.customId === 'Stop' && i.user.id === m.author.id;
    const collector = m.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async i => {
        if(i.customId === label){
            content = !notifications ? 'Enabled' : 'Disabled';
            structures.registeredUsers[index].notifications = !notifications;
            database.updateNotifications(structures.registeredUsers[index]);
            await i.reply(`Changed the notification settings to ${content}`);
        } else {
            await i.reply('Interaction stopped!');
        }
    });
}

async function enableTrading(message){
    message.author.send(`Generate you API key with setting "Trading" allowed\nPlease enter your API data. Enter API key first.`);
    let filter = m => m.author != '815660797236740121';
    let key, secret;

    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
            let iterator = collected.entries();
            key = iterator.next().value[1].content;
            message.reply('Enter your API Secret.');
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async collected => {
                let iterator = collected.entries();
                secret = iterator.next().value[1].content;
                message.reply(`Your entered API key: ${key}, and your secret: ${secret}`);
                //let res = await binance.getAccountInformation(key, secret);
                message.reply(`Successfully established connection to exchange! News Trading is now enabled.`)
            })
            .catch((err) => {
                console.log(err);
            })
		})
        .catch(() => {
            console.log(`User interaction finished`);
        });
}

async function addTwitterAccount(message){
    message.reply('Please enter twitter username without "@" handle. You have 30 seconds.');

    let filter = m => m.author != '815660797236740121';
    const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

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
                    account.latestTweet = tweets[0].id;
                    structures.twitterAccounts.push(account);
                    database.trackTwitterAccount(account);
                    twitter.checkForNewTweets(account);
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

export default{
    followAccount,
    deregister,
    enableTrading,
    addTwitterAccount,
    keywords,
    notifications,
    unfollowAccount
}