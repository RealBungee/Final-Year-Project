//import  { saveObjects } from "./saveFile.js";
import helperFunctions from "../helperFunctions/index.js";
async function reactionCollector(client, registeredUsers, discordUserObjects) {
  let channel = await client.channels.fetch('934165450084978718')
  .catch(console.error);
  let message = await channel.messages.fetch('938131309019164675')
  .catch(console.error);

  const filter = (reaction) => reaction.emoji.name === '🤏';
  const collector = await message.createReactionCollector({ filter });

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
    user.send(`Hello ${user.username}, thanks for registering to the bot!`);
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