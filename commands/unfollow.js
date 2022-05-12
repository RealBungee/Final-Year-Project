import structures from '../data/structures.js';
import {MessageActionRow, MessageButton} from 'discord.js';
import database from '../helperFunctions/database.js';

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

export{
    unfollowAccount
}

