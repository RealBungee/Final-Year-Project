import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config.js';

const commands = [];
const commandFiles = readdirSync('./commands/slashCommands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
	const command = await import(`./slashCommands/${file}`);
	commands.push(command.data);
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();