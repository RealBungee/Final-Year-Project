import { getUserTimeline } from './getUserTimeline.js';

async function getLatestTweet(twitterKeys, account){
    let tweets;
    try{
      tweets = await getUserTimeline(twitterKeys, account);
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