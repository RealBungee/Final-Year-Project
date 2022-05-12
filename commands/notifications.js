import structures from "../data/structures.js";
import database from "../helperFunctions/database.js";
import { MessageActionRow, MessageButton } from 'discord.js';

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

export {
    notifications
}