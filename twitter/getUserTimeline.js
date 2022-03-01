import needle from 'needle';

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
const getUserTimeline = async(token, user) => {
    const url = `https://api.twitter.com/2/users/${user.id}/tweets`;
    let userTweets = [];
    // we request the author_id expansion so that we can print out the user name later

    let params = {
        "max_results": 5,
        "tweet.fields": "created_at",
        "expansions": "author_id",
        "media.fields": "url"
    }

    if(!user.latestTweet == ''){
        params["since_id"] = user.latestTweet;
    }
  
    const options = {
        headers: {
            "User-Agent": "v2UserTweetsJS",
            "authorization": `Bearer ${token.bearerToken}`
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
  
    console.dir(userTweets, {
        depth: null
    });
    console.log(`Got ${userTweets.length} Tweets from ${user.username} (user ID ${user.id})!`);
    return userTweets;
}

export {
    getUserTimeline
}