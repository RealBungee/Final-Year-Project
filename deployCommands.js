import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import data from './config.js';

const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
	const command = import(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(data.token);

rest.put(Routes.applicationGuildCommands(data.clientId, data.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);