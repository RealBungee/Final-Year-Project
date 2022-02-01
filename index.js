//discord imports
const fs = require('fs');
const { token, twitterKeys } = require('./config.json');
const { Client, Intents, Collection, Message, ChannelManager, Channel } = require('discord.js');
const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES], 
  partials: [Message, ChannelManager, Channel] });
const twitter = require('./twitter/index.js');
const discord = require('./discord/index.js');

//load in slash Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

var registrationChannel;
var registrationMessage;
//Actions to perform when Bot comes online
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  registrationChannel = await client.channels.fetch('934165450084978718')
  .catch(console.error);
  registrationMessage = await registrationChannel.messages.fetch('938131309019164675')
  .catch(console.error);

  console.log(`Starting the reaction listener for ${registrationMessage.content} message`);
  discord.reactionRegister(registrationMessage, registrationChannel, client);


  //this is the part of code that will be used for retrieving tweets
  //it should be recursive and keep calling from array of users objects

  // const userId = "44196397";
  // const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  // const since = 1453839051379724289;
  // // twitter.getUserTimeline(twitterKeys, url, userId);
  // twitter.getUser(twitterKeys);
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

client.login(token);