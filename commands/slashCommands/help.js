import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Shows youtube tutorials for specific commands.')

export {
    data
}

