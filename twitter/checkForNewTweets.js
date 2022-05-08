import { getUserTimeline } from './getUserTimeline.js';
import { notifyUser } from '../discord/notifyUsers.js';
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
        //if the map returns undefined on twitterAccount.username then do nothing
        console.log(keywords);
        if(keywords != undefined ){
          if(keywords.length == 0 && u.notifications){
            notifyUser(twitterAccount, t);
          } else if(keywords.length > 0){
            console.log(`Checking for mentions of user keywords in retrieved tweets`);
            for(let k of keywords){
              if(t.text.toLowerCase().includes(k)){
                console.log(`${twitterAccount.username} has mentioned ${k} in their tweet!`);
                notifyUser(twitterAccount, t, k);
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