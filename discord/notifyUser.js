import { MessageEmbed } from 'discord.js';
import structures from '../data/structures.js';

async function notifyUser(user, account, tweet, keyword){
    let tweetUrl = `https://twitter.com/${account.username}/status/${tweet.id}`;
    let description= '';

    if(keyword != undefined){
      description = `User: ${account.username} has mentioned ${keyword} in their tweet!`;
    } else {
      description = `New tweet by ${account.username}`;
    }

    const notificationEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('New tweet mention alert!')
      .setDescription(description)
      .setThumbnail(tweetUrl)
      .addField('Tweet Link', tweetUrl, true);

    const discordUser = await structures.discordUsers.find(u => u.id == user.id);
    discordUser.send({ embeds: [notificationEmbed]});
  }

  export {
    notifyUser
  }