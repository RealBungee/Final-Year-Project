//imports
const needle = require('needle');
<<<<<<< HEAD
const { Client, Intents } = require('discord.js');
const { token, clientId, guildId, twitter } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const since = 1453839051379724289
=======
const { Client, Intents, Message } = require('discord.js');
const Discord = require('discord.js');
const { token, twitter } = require('./config.json');
const reactionRole = require('./reactionRole');
const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ["MESSAGE", "CHANNEL", "REACTION"] });

const userId = "44196397";
const url = `https://api.twitter.com/2/users/${userId}/tweets`;
const since = 1453839051379724289;

const prefix = '!';

// const channel = client.channels.fetch('934165450084978718')
//   .then(channel => console.log(channel.name));
>>>>>>> cbb310a03febd317d0a1710ab4f7a5379a3552e2

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

<<<<<<< HEAD
  
  client.once('ready', () => {
    console.log('Ready!');
  });
  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;
=======
client.once('ready', () => {
  console.log('Ready!');
});
>>>>>>> cbb310a03febd317d0a1710ab4f7a5379a3552e2
  
client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/\s+/);
  const command = args.shift().toLocaleLowerCase();
  if (command === 'reactionrole') {
    client.commands.get('reactionrole').execute(message, args, Discord, client);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'server') {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  } else if (commandName === 'user') {
    getUserTweets();
    await interaction.reply('Elon Musk tweeted about DOGE in tweet: https://twitter.com/elonmusk/status/1454876031232380928 \n Bought DOGE with 15 minute hold period');
  } else if (commandName === 'settradeholdtime'){
    await interaction.reply('Trade hold time set to 15 minutes');
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

client.login(token);