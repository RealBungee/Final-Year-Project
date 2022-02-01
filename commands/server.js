import { SlashCommandBuilder } from '@discordjs/builders';

 const data = new SlashCommandBuilder()
	.setName('sever')
	.setDescription('Replies with Pong!');
 async function execute(interaction) {
	await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
}

export default{
	data,
	execute
}