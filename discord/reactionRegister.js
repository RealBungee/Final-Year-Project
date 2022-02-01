
async function reactionRegister(client) {
    
  const channel = await client.channels.fetch('934165450084978718')
  .catch(console.error);
  const message = await channel.messages.fetch('938131309019164675')
  .catch(console.error);

  const filter = (reaction) => reaction.emoji.name === '🤏';
  const collector = await message.createReactionCollector({ filter });
  collector.on('collect', (reaction, user) => console.log(`Collected ${reaction.emoji.name} from ${user.username}`));
}

export {
    reactionRegister
}