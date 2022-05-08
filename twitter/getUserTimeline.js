import needle from 'needle';
import config from '../config.js';

const getPage = async (params, options, nextToken, url) => {
    if (nextToken) {
        params.pagination_token = nextToken;
    }
  
    try {
        const resp = await needle('get', url, params, options);
  
        if (resp.statusCode != 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}

//takes in twitter user object
const getUserTimeline = async(user) => {
    const url = `https://api.twitter.com/2/users/${user.id}/tweets`;
    let userTweets = [];
    // we request the author_id expansion so that we can print out the user name later

    let params = {
        "tweet.fields": "created_at",
        "expansions": "author_id",
        "media.fields": "url",
        "max_results": 20
    }

    if(!user.latestTweet == ''){
        params["since_id"] = user.latestTweet;
    }
  
    const options = {
        headers: {
            "User-Agent": "v2UserTweetsJS",
            "authorization": `Bearer ${config.twitterKeys.bearerToken}`
        }
    }
  
    let hasNextPage = true;
    let nextToken = null;
    let userName;
    console.log("Retrieving Tweets...");
  
    while (hasNextPage) {
        let resp = await getPage(params, options, nextToken, url);
        if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
            userName = resp.includes.users[0].username;
            if (resp.data) {
                userTweets.push.apply(userTweets, resp.data);
            }
            if (resp.meta.next_token) {
                nextToken = resp.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }
  
    console.log(`Got ${userTweets.length} Tweets from ${user.username} (userID:${user.id})!`);
    return userTweets;
}

export {
    getUserTimeline
}