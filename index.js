//discord imports
const fs = require('fs');
const { token, twitterKeys } = require('./config.json');
const { Client, Intents, Collection, Message, ChannelManager, Channel } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: [Message, ChannelManager, Channel] });
const twitter = require('./twitter/index.js');

//load in slash Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

//Actions to perform when Bot comes online
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  const registrationChannel = await client.channels.fetch('934165450084978718')
  .catch(console.error);
  const registrationMessage = await registrationChannel.messages.fetch('934166359552688159')
  .catch(console.error);
  console.log(registrationMessage.content);

  const userId = "44196397";
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  const since = 1453839051379724289;
  // twitter.getUserTimeline(twitterKeys, url, userId);
  twitter.getUser(twitterKeys);
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

// const reactionMessage = channel.messages.fetch("934166359552688159")
//   .then(messages => console.log(messages.content))
//   .catch(console.error);

// const filter = (reaction, user) => {
//   return reaction.emoji.name === 'KEKBye' && user.id === Message.author.id;
// };

// const collector = message.createReactionCollector({ filter, time: 15000});

// collector.on('collect', (reaction, user) => {
//   console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
// });

// collector.on('end', collected => {
//   console.log(`Collected ${collected.size} items`);
// });

client.login(token);