//discord imports
import  config from './config.js';
import { Client, Intents, Collection, Message, ChannelManager, Channel } from 'discord.js';
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES], 
  partials: [Message, ChannelManager, Channel] });

//My own function imports for twitter, discord and binance functionality
import twitter from './twitter/index.js';
import discord from './discord/index.js';
import ping from './commands/ping.js';
import server from './commands/server.js';
import user from './commands/user.js';

//Data structures
var registeredUsers = [];


//Load in files or data structures
// import * as fileOfRegisteredUsers from './discord/registeredUsers.txt';
// registeredUsers = fileOfRegisteredUsers.name;
// console.log(registeredUsers);

//load in slash Commands
client.commands = new Collection();

  client.commands.set(ping.data.name, {execute:ping.execute});
  client.commands.set(server.data.name, {execute:server.execute});
  client.commands.set(user.data.name, {execute:user.execute});

//Actions to perform when Bot comes online
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Starting the reaction listener for message in react-to-register channel`);

  //starts the reaction listener for a message in react-to-register channel
  discord.reactionCollector(client, registeredUsers);

  //this is the part of code that will be used for retrieving tweets
  //it should be recursive and keep calling from array of users objects

  // const userId = "44196397";
  // const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  // const since = 1453839051379724289;
  // // twitter.getUserTimeline(config.twitterKeys, url, userId);
  // twitter.getUser(config.twitterKeys);
});

client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if(!command) return;

  try{
    await command.execute(interaction);
  } catch (error){
      console.error(error);
      return interaction.reply({ content: 'There was an error executing this command!', ephemeral: true});
  }
});

client.login(config.token);