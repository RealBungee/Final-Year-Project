import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('deregister')
	.setDescription('Command deregisters you from the bot.')

export {
    data
}

