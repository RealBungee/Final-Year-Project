import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('addaccount')
	.setDescription('Add an additional twitter account to track - only usable by owner.')

export {
    data
}
