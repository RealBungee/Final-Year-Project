import { getUserTimeline } from './getUserTimeline.js';
import config from '../config.js';

async function getLatestTweet(account){
    let tweets;
    try{
      tweets = await getUserTimeline(account, config.twitterKeys);
    } catch(error){
      console.log(`Error fetching most recent tweet: ${error}`)
    }
    if(tweets != ''){
      account.latestTweet = tweets[0].id;
    }
  }

  export {
      getLatestTweet
  }