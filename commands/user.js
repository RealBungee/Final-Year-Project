const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with elons tweet'),
	async execute(interaction) {
		await interaction.reply('Elon Musk tweeted about DOGE in tweet: https://twitter.com/elonmusk/status/1454876031232380928 \n Bought DOGE with 15 minute hold period');
	},
};