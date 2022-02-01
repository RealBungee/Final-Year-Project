
async function reactionRegister(message, channel, client) {
  filter = (reaction) => reaction.emoji.name === '🤏';
  collector = await message.createReactionCollector({ filter });
  collector.on('collect', (reaction, user) => console.log(`Collected ${reaction.emoji.name} from ${user.username}`));

  client.on('messageReactionAdd', async(reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    if(!reaction.message.guild) return;

    if(reaction.message.channel === channel.id){
        console.log(`Collected ${reaction.emoji.name} from ${user.username}`);
    }
  });
}

module.exports = {
    reactionRegister
}