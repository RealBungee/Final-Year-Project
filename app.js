//API keys imports from config.js into config
import  config from './config.js';
//discord imports
import { Client, Intents, Collection } from 'discord.js';

//My own function imports for twitter, discord and binance functionality
import twitter from './twitter/index.js';
import discord from './discord/index.js';
import events from './events/index.js';
import ping from './commands/ping.js';
import server from './commands/server.js';
import helperFunctions from './helperFunctions/index.js';

//create discord Client with needed Intents and Partials
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES], 
  partials: ["MESSAGE", "CHANNEL", "REACTION"]});

//example twitter accounts objects
//used for testing
var twitterTestAccount = {
  id: '1256716686',
  name: 'TestingAccount',
  username: 'test66664599',
  latestTweet: ''
}

//load in slash Commands
client.commands = new Collection();
client.commands.set(ping.data.name, {execute:ping.execute});
client.commands.set(server.data.name, {execute:server.execute});

//Actions to perform when Bot comes online
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  console.log("Fetching registered users.");
  await helperFunctions.database.getRegisteredUsers();

  console.log("Fetching discord user objects for registered users");
  await helperFunctions.getDiscordUsers(client);
  
  console.log('Fetching tracked twitter accounts');
  await helperFunctions.database.getTwitterAccounts();

  console.log("Starting reaction listener for registrations.");
  discord.reactionCollector(client);

  console.log(`Fetching latest tweets from tracked twitter accounts.`)
  await twitter.getLatestTweet(twitterTestAccount);

  console.log(`Received all tracked users' most recent tweets. Starting the new tweet checking function.`);
 // twitter.checkForNewTweets(twitterTestAccount)

  console.log(`Starting the private message listener.`);
  events.messageListener(client);
});

client.login(config.token);