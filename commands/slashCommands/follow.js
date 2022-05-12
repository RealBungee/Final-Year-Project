import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('follow')
	.setDescription('Allows you to follow one of available twitter accounts')

export {
    data
}