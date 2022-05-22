import { getUserTimeline } from './getUserTimeline.js';
import { notifyUser } from '../discord/notifyUser.js';
import structures from '../data/structures.js';
import database from '../helperFunctions/database.js';

function checkForNewTweets(twitterAccount){
    setTimeout( async () => {
        let tweets = await getUserTimeline(twitterAccount);
        if(tweets != ''){
            twitterAccount.latestTweet = tweets[0].id;
            database.updateNewTweet(twitterAccount, tweets[0].id);
            analyiseTweets(tweets, twitterAccount);
        }
      checkForNewTweets(twitterAccount);
    }, 5000);
  }

  async function analyiseTweets(tweets, twitterAccount){
    for(let t of tweets){
      for(let u of structures.registeredUsers){
        let keywords = u.followedAccounts.get(twitterAccount.username);
        if(keywords != undefined ){
          if(keywords.length === 0 && u.notifications){
            notifyUser(u, twitterAccount, t);
          } else if(keywords.length > 0){
            for(let k of keywords){
              if(t.text.toLowerCase().includes(k.toLowerCase())){
                notifyUser(u, twitterAccount, t, k);
              }
            }
          }
        }
      }
    }
  }

  export {
      checkForNewTweets
  }