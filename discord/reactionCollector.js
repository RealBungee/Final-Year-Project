//import  { saveObjects } from "./saveFile.js";
import { MessageEmbed } from 'discord.js';
import helperFunctions from '../helperFunctions/index.js';
import structures from '../data/structures.js';

async function reactionCollector(client) {
  const filter = (reaction) => reaction.emoji.name === '🤏';
  var message = '';

  await client.channels.fetch('934165450084978718')
  .catch(console.error)
  .then (async channel => {
    message = await channel.messages.fetch('938131309019164675')
    .catch(console.error)
  });
  
  const collector = message.createReactionCollector({ filter });
  console.log("Reaction collector started!");

  collector.on('collect', (reaction, user) => {
    checkIfRegistered(user);
  });
}

function checkIfRegistered(user){
  if(!structures.discordUsers.includes(user)){
    const registrationEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('WELCOME!')
    .setDescription(`Hello ${user.username}, thank you for registering to the bot!\n
      Commands are only available in Direct Messaging (We do not want to leak your information)
      You are automatically subscribed to Elon Musk's tweets.
      Use commands to add/remove subscriptions`)
    .addField('Help info', `Please type "help" to show available commands`, true);
    
    user.send({ embeds: [registrationEmbed]});
    let u = {
      id: user.id,
      allowTrading: false,
      notifications: false,
      binanceApiKey: '',
      binanceApiSecret: '',
    }
    structures.registeredUsers.push(u);
    structures.discordUsers.push(user);
    
    console.log(`Adding user ${user.id} to list of registered users in database.`);
    helperFunctions.database.addNewRegisteredUser(u);
  }
}

export {
    reactionCollector
}