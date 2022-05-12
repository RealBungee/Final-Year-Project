import structures from '../data/structures.js';
import database from '../helperFunctions/database.js';
import awaitKeywords from '../keywordHelper.js';
import { MessageActionRow, MessageButton } from 'discord.js';


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
    let content = `Selected: ${account}.\nClick on the keyword you would like to remove:`;
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

export{
    keywords
}