import structures from '../data/structures.js';
import database from '../helperFunctions/database.js';
import { MessageActionRow, MessageButton } from 'discord.js';


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

export {
    followAccount
}