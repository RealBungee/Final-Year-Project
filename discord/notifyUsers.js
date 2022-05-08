import structures from '../data/structures.js'
import { MessageEmbed } from 'discord.js';

async function notifyUser(user, tweet, keyword){
    let tweetUrl = `https://twitter.com/${user.username}/status/${tweet.id}`;
    let description= '';
    if(keyword != undefined){
      description = `User: ${user.username} has mentioned ${keyword} in their tweet!`;
    } else {
      description = `New tweet by ${user.username}`;
    }
    const notificationEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('New tweet mention alert!')
      .setDescription(description)
      .setThumbnail(tweetUrl)
      .addField('Tweet Link', tweetUrl, true);
    for(let u of structures.discordUsers){
      u.send({ embeds: [notificationEmbed]});
    }
  }

  export {
    notifyUser
  }