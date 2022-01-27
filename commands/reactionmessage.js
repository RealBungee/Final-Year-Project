const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionmessage')
		.setDescription('reactionmessage'),
    async execute(message, args, Discord, client){
        const channel = '934165450084978718';
        const registerEmoji = ':kekbye:';

        let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('React to register for the bot');

        let MessageEmbed = await message.channel.send(embed);
        await MessageEmbed.react(registerEmoji);

        client.on('messageReactionAdd', async (reaction, user) => {
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(!reaction.message.guild) return;

            if(reaction.message.channel.id = channel){
                if(reaction.emoji.name === registerEmoji){
                    console.log("A user is trying to register");
                }
            }
        });
    }
};