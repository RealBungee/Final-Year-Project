import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('add')
	.setDescription('Add an additional twitter account to track - only usable by owner.')

export {
    data
}
