<<<<<<< HEAD
//discord imports
const fs = require('fs');
const { token, twitter } = require('./config.json');
const { Client, Intents, Collection, Message, ChannelManager, Channel } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: [Message, ChannelManager, Channel] });
const userTimeline = require('./twitterFunctions/get-user-timeline.js');
const twitterUserId = require('./twitterFunctions/get-user-id.js');

//load in slash Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
=======
//imports
const fs = require('fs');
const needle = require('needle');
const { Client, Intents, Message } = require('discord.js');
const { token, clientId, guildId, twitter } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ["MESSAGE", "CHANNEL", "REACTION"] });

client.commands = new Collection();

const since = 1453839051379724289;

const prefix = '!';

// const channel = client.channels.fetch('934165450084978718')
//   .then(channel => console.log(channel.name));
>>>>>>> 89896bf97b2c5a3272ae4064b08f11d51de2c29e

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
//   userTimeline.getUserTimeline(twitter, url, userId);
  twitterUserId.getRequest(twitter);
});

client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

<<<<<<< HEAD
  if(!command) return;

  try{
    await command.execute(interaction);
  } catch (error){
      console.error(error);
      return interaction.reply({ content: 'There was an error executing this command!', ephemeral: true});
=======
  if (commandName === 'ping') {
    client.get('reactionrole').execute(message, args, Discord, client);
  } else if (commandName === 'server') {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  } else if (commandName === 'user') {
    getUserTweets();
    await interaction.reply('Elon Musk tweeted about DOGE in tweet: https://twitter.com/elonmusk/status/1454876031232380928 \n Bought DOGE with 15 minute hold period');
  } else if (commandName === 'settradeholdtime'){
    await interaction.reply('Trade hold time set to 15 minutes');
>>>>>>> 89896bf97b2c5a3272ae4064b08f11d51de2c29e
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

<<<<<<< HEAD
=======
  const userId = "44196397";
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  const getUserTweets = async () => {
    let userTweets = [];

    // we request the author_id expansion so that we can print out the user name later
    let params = {
      "max_results": 100,
      "tweet.fields": "created_at",
      "expansions": "author_id"
  }

  const options = {
      headers: {
          "User-Agent": "v2UserTweetsJS",
          "authorization": `Bearer ${twitter.bearerToken}`
      }
  }

  let hasNextPage = true;
  let nextToken = null;
  let userName;
  console.log("Retrieving Tweets...");

  while (hasNextPage) {
      let resp = await getPage(params, options, nextToken);
      if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
          userName = resp.includes.users[0].username;
          if (resp.data) {
              userTweets.push.apply(userTweets, resp.data);
          }
          if (resp.meta.next_token) {
              nextToken = resp.meta.next_token;
          } else {
              hasNextPage = false;
          }
      } else {
          hasNextPage = false;
      }
  }

  console.dir(userTweets, {
      depth: null
  });
  console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`);

}

const getPage = async (params, options, nextToken) => {
  if (nextToken) {
      params.pagination_token = nextToken;
  }

  try {
      const resp = await needle('get', url, params, options);

      if (resp.statusCode != 200) {
          console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
          return;
      }
      return resp.body;
  } catch (err) {
      throw new Error(`Request failed: ${err}`);
  }
}

>>>>>>> 89896bf97b2c5a3272ae4064b08f11d51de2c29e
client.login(token);