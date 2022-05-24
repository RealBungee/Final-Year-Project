import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('notifications')
	.setDescription('Enable/Disable notifications')

export {
    data
}

