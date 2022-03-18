import { MessageEmbed } from 'discord.js';

const helpEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help and extra commands')
    .setDescription(`All provided commands are constricted to direct messsaging with the bot\n
    Please do not use given commands in server channels\n
    To enact a command, write only the command name as found in command list below:`)
    .addField('followUser', `Command used to follow another user on twitter - bot will ask you to enter username or user id`, true);

function messageListener(client){
    client.on('messageCreate', message => {
        if(message.channel.type == 'DM' && message.content.toLowerCase() === 'help'){
            message.author.send({ embeds: [helpEmbed]});
        }
    });
}

export {
    messageListener
}