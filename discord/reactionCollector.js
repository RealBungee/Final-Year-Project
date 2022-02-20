import  { saveObjects } from "./saveFile.js";
async function reactionCollector(client, registeredUsers) {
  const channel = await client.channels.fetch('934165450084978718')
  .catch(console.error);
  const message = await channel.messages.fetch('938131309019164675')
  .catch(console.error);

  const filter = (reaction) => reaction.emoji.name === '🤏';
  const collector = await message.createReactionCollector({ filter });

  collector.on('collect', (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.username}!`)
    checkIfRegistered(user, registeredUsers);
  });
}

function checkIfRegistered(user, registeredUsers){
  let isRegistered = false;
  for(const u of registeredUsers){
    if(u.id == user.id){ isRegistered = true;}
  }

  if(!isRegistered){
    user.send(`Hello ${user.username}, thanks for registering to the bot!`);
    user.flags = "";
    user.banner = "";
    user.accentColor = "";
    registeredUsers.push(user);
    console.log(`Registered ${user.saveUsers}. Saving to file for backup.`);
    saveObjects('./data/registeredUsers.json');
    saveUsers(registeredUsers);
  }
}

export {
    reactionCollector
}