import { getUserTimeline } from './getUserTimeline.js';
import config from '../config.js';
import structures from '../data/structures.js';
import database from '../helperFunctions/database.js';

async function getLatestTweets(){
    let tweets;
    for(let a of structures.twitterAccounts){
      try{
        tweets = await getUserTimeline(a, config.twitterKeys);
      } catch(error){
        console.log(`Error fetching most recent tweet: ${error}`)
      }
      if(tweets != ''){
        a.latestTweet = tweets[0].id;
        database.updateNewTweet(a, tweets[0].id);
      }
    }
  }

  export {
      getLatestTweets
  }