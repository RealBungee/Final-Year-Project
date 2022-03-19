async function notifyUsers(user, tweet, discordUsers){
    let tweetUrl = `https://twitter.com/${user.username}/status/${tweet.data[0].id}`;
    const notificationEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('New tweet mention alert!')
      .setDescription(`User: ${user.username} has mentioned DOGE in their tweet!`)
      .setThumbnail(tweetUrl)
      .addField('Tweet Link', tweetUrl, true);
    for(let u of discordUsers){
      u.send({ embeds: [notificationEmbed]});
    }
  }

  export {
    notifyUsers
  }