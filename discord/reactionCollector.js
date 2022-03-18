//import  { saveObjects } from "./saveFile.js";
import helperFunctions from "../helperFunctions/index.js";
import {MessageEmbed} from 'discord.js';

async function reactionCollector(client, registeredUsers, discordUserObjects) {
  const filter = (reaction) => reaction.emoji.name === '🤏';
  var message = '';
  
  await client.channels.fetch('934165450084978718')
  .catch(console.error)
  .then (async channel => {
    message = await channel.messages.fetch('938131309019164675')
    .catch(console.error)
  });
  
  const collector = message.createReactionCollector({ filter });

  collector.on('collect', (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.username}!`)
    checkIfRegistered(user, registeredUsers, discordUserObjects);
  });
  console.log("Reaction collector started!");
}

function checkIfRegistered(user, registeredUsers, discordUserObjects){
  let isRegistered = false;
  for(const u of registeredUsers){
    if(u.id == user.id){ isRegistered = true;}
  }
  if(!isRegistered){
    const registrationEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('WELCOME!')
    .setDescription(`Hello ${user.username}, thank you for registering to the bot!\n
      Commands are only available in Direct Messaging (We do not want to leak your valuable information)`)
    .addField('Help info', `Please type "help" to show available commands`, true);
    user.send({ embeds: [registrationEmbed]});

    let u = {
      id: user.id,
      allowTrading: false,
      binanceApiKey: '',
      binanceApiSecret: '',
    }
    registeredUsers.push(u);
    discordUserObjects.push(user);
    console.log(`Registered ${user.username}.`);
    
    //saveObjects('./data/registeredUsers.json', registeredUsers);
    helperFunctions.addNewRegisteredUser(u);
  }
}


export {
    reactionCollector
}