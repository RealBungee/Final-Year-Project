import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('follow')
	.setDescription('Use to follow one of available twitter accounts')

export {
    data
}