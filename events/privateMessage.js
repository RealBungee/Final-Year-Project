import { MessageEmbed } from 'discord.js';
import structures from '../data/structures.js';
import privateCommands from '../discord/privateCommands.js';

const helpEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help and extra commands')
    .setDescription(`All provided commands are constricted to direct messsaging with the bot\n
    Please do not use given commands in server channels\n
    To enact a command, write only the command name as found in command list below:`)
    .addField('followAccount', `Command used to follow another user on twitter - bot will ask you to enter username or user id`, true)
    .addField('enableTrading', `Allow the bot to place trades on Binance exchange. Will require API keys.`, true)
    .addField('deregister', `Deregister from the bot - removes all your data (API keys, preferences, etc.)`, true);

const commands = ['followAccount', 'enableTrading', 'deregister'];

function messageListener(client){
    client.on('messageCreate', message => {
        let content = message.content;
        let author = message.author;

        if(message.channel.type == 'DM'){
            if(structures.discordUsers.includes(author)){
                if(author.id == '274614462147985408'){
                    if(content === 'addTwitter'){
                        privateCommands.addTwitterAccount(message);
                    }
                }
                if(content === 'help'){
                    author.send({ embeds: [helpEmbed]});
                }
                else if(commands.includes(content)){
                    privateCommands[content](message);
                }
            }
        }
    });
}

export {
    messageListener
}