import fs from 'fs';
async function reactionCollector(client, registeredUsers) {
    
  const channel = await client.channels.fetch('934165450084978718')
  .catch(console.error);
  const message = await channel.messages.fetch('938131309019164675')
  .catch(console.error);

  const filter = (reaction) => reaction.emoji.name === '🤏';
  const collector = await message.createReactionCollector({ filter });

  collector.on('collect', (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.username}`)
    console.log(registeredUsers.length);
    registerUser(registeredUsers, user);
  });
}

function registerUser(registeredUsers, user){
  var isRegistered = false;
  for(let i = 0; i< registeredUsers.length; i++){
    if (registeredUsers[i].id === user.id) isRegistered = true;
  }

  if(!isRegistered){
    user.send(`Hello ${user.username}, thanks for registering to the bot`);
    registeredUsers.push(user);
    console.log(registeredUsers);
  }

//   for(let i = 0; i< registeredUsers.length; i++){
//     fs.writeFile("registeredUsers.txt", registeredUsers[i], (err) => {
//       if (err) {
//           console.log(err);
//       }
//   });
//   }
}

export {
    reactionCollector
}