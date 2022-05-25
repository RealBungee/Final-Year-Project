import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
	.setName('trading')
	.setDescription('Use to follow one of available twitter accounts')
    .addStringOption(option =>
		option.setName('key')
			.setDescription('Your Binance API Key')
			.setRequired(true))
    .addStringOption(option =>
        option.setName('secret')
            .setDescription('Your Binance API Secret')
            .setRequired(true));

export {
    data
}