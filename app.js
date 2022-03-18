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

//Data structures
var registeredUser = {
  id: '125125123',
  allowTrading: false,
  binanceApiKey: '51241234',
  binanceApiSecret: '5123123',
}
var registeredUsers = [];
var discordUsers = [];
var trackedTwitterAccounts = [];
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

  console.log("Attempting to load registered users.");
  //registeredUsers = await discord.loadUsers('./data/registeredUsers.json');
  registeredUsers = await helperFunctions.getRegisteredUsers();

  console.log("Fetching discord user objects for registered users");
  discordUsers = await discord.getDiscordUsers(client, registeredUsers);

  console.log("Starting reaction listener for registrations.");
  discord.reactionCollector(client, registeredUsers, discordUsers);

  console.log(`Fetching latest tweets from tracked twitter accounts.`)
  await twitter.getLatestTweet(config.twitterKeys, twitterTestAccount);
  console.log(twitterTestAccount);

  console.log(`Received all tracked users' most recent tweets. Starting the new tweet checking function.`);
  twitter.checkForNewTweets(config.twitterKeys, twitterTestAccount)

  events.privateMessageResponse(client, 'ping', 'pong');
});

// client.on('interactionCreate', async interaction => {
//   let message = interaction.message;
//   if(message.channel.type == 'dm'){
//     if(message.content.toLowerCase() == 'ping'){
//       message.author.send('pong');
//     }
//   }
// });

client.login(config.token);