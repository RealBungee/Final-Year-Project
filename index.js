//API keys imports from config.js into config
import  config from './config.js';
//discord imports
import { Client, Intents, Collection, Message, ChannelManager, Channel, MessageEmbed} from 'discord.js';

//My own function imports for twitter, discord and binance functionality
import twitter from './twitter/index.js';
import discord from './discord/index.js';
import ping from './commands/ping.js';
import server from './commands/server.js';
import user from './commands/user.js';

//create discord Client with needed Intents and Partials
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES], 
  partials: [Message, ChannelManager, Channel] });

//Data structures
var registeredUsers = [];
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
client.commands.set(user.data.name, {execute:user.execute});

//Actions to perform when Bot comes online
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  console.log("Attempting to load registered users.");
  registeredUsers = await discord.loadUsers('./data/registeredUsers.json', client);

  console.log("Starting reaction listener for registrations.");
  discord.reactionCollector(client, registeredUsers);

  console.log(`Fetching latest tweets from users.`)
  await getLatestTweet();
});

//should call this at startup 
async function getLatestTweet(){
  let tweets;
  try{
    tweets = await twitter.getUserTimeline(config.twitterKeys, twitterTestAccount);
  } catch(error){
    console.log(`Error fetching most recent tweet: ${error}`)
  }
  if(tweets != ''){
    twitterTestAccount.latestTweet = tweets[0].id;
  }
}

function checkForNewTweets(){
  setTimeout( async () => {
    let tweets;
    try{
      //this is for testing, in deployed app we should check user timelines of all
      //tracked twitter users
      tweets = await twitter.getUserTimeline(config.twitterKeys, twitterTestAccount);
    } catch(error){
      console.log(`Caught error while trying to get user timeline from: ${twitterTestAccount} \n ${error}`);
    }
    if(tweets != ''){
      twitterTestAccount.latestTweet = tweets[0].id;
      checkForMentions(tweets, twitterTestAccount, "DOGE");
      console.log(twitterTestAccount.latestTweet);
    }
    checkForNewTweets();
  }, 6000);
}

function checkForMentions(tweets, user, keyword){
  console.log(`Checking for mentions of ${keyword} in retrieved tweets`);
  for(let t of tweets){
    if(t.text.toUpperCase().includes(keyword)){
      console.log(`User: ${user.username} has mentioned ${keyword} in their tweet!`);
      console.log('Attempting to notify the registered users');
      notifyUsers(user, t);
      //break because we only care about the most recent tweet (tweets saved from most recent to least) 
      break;
    }
  }
}

async function notifyUsers(user, tweet){
  let fullTweet;
  try{
    fullTweet = await twitter.getTweets(tweet, config.twitterKeys);
  } catch(error){
    console.log("Error fetching tweet containing mention of keyword\n", error);
  }
  let tweetUrl = `https://twitter.com/${user.username}/status/${fullTweet.data[0].id}`;
  const notificationEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('New tweet mention alert!')
    .setDescription(`User: ${user.username} has mentioned DOGE in their tweet!`)
    .setThumbnail(tweetUrl)
    .addField('Tweet Link', tweetUrl, true);
  for(let u of registeredUsers){
    u.send({ embeds: [notificationEmbed]});
  }
}

//this is how to handle private messages
//will be used for adding people to follow, taking in exchange API's 
client.on('messageCreate', async (message) => {
  if(message.channel.type === 'DM'){
    if(message.content.toLowerCase() === 'ping'){
      message.author.send('pong');
    }
  }
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

checkForNewTweets();

client.login(config.token);