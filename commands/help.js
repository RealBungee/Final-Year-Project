import { MessageEmbed } from "discord.js";

const helpEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help and extra commands')
    .setDescription(`All provided commands are constricted to direct messsaging with the bot\n
    Please do not use given commands in server channels\n
    To enact a command, write only the command name as found in command list below:`)
    .addField('followAccount', `Command used to follow another user on twitter - bot will ask you to enter username or user id.`, true)
    .addField('keywords', `Manage your keywords for followed accounts (add, delete).`, true)
    .addField('enableTrading', `Allow the bot to place trades on Binance exchange. Will require API keys.`, true)
    .addField('deregister', `Deregister from the bot - removes all your data (API keys, preferences, etc.)`, true)
    .addField('notifications', 'Enable notifications of all new tweets from your subscribed accounts.', true);


async function help(interaction){
    await interaction.reply({ embeds: [helpEmbed]});
}

export{
    help
}