import { getUserTimeline } from './getUserTimeline.js';
import { notifyUsers } from '../discord/notifyUsers.js';
import { getTweets } from './getTweets.js';
import config from '../config.js';

function checkForNewTweets(twitterAccount){
    setTimeout( async () => {
        let tweets = await getUserTimeline(twitterAccount, config.twitterKeys);
        if(tweets != ''){
            twitterAccount.latestTweet = tweets[0].id;
            checkForMentions(tweets, twitterAccount, "DOGE");
        }
      checkForNewTweets(twitterAccount);
    }, 5000);
  }

  async function checkForMentions(tweets, twitterAccount, keyword){
    console.log(`Checking for mentions of user keywords in retrieved tweets`);
    for(let t of tweets){
      if(t.text.toUpperCase().includes(keyword)){
        console.log(`User: ${twitterAccount.username} has mentioned ${keyword} in their tweet!`);
        let fullTweet = '';
        try{
            fullTweet = await getTweets(t, config.twitterKeys);
          } catch(error){
            console.log("Error fetching tweet containing mention of keyword\n", error);
          }
        console.log('Attempting to notify the subscribed users');
        notifyUsers(twitterAccount, fullTweet);
        //break because we only care about the most recent tweet (tweets saved from most recent to least) 
        break;
      }
    }
  }

  export {
      checkForNewTweets
  }