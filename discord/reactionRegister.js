
async function reactionRegister(message, channel, client) {
  filter = (reaction) => reaction.emoji.name === '🤏';
  collector = await message.createReactionCollector({ filter });
  collector.on('collect', (reaction, user) => console.log(`Collected ${reaction.emoji.name} from ${user.username}`));
}

module.exports = {
    reactionRegister
}