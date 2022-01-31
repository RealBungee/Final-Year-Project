const needle = require('needle');

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

const getUserTimeline = async(twitter, url, userId) => {
    let userTweets = [];
    // we request the author_id expansion so that we can print out the user name later
    let params = {
        "max_results": 5,
        "tweet.fields": "created_at",
        "expansions": "author_id"
    }
  
    const options = {
        headers: {
            "User-Agent": "v2UserTweetsJS",
            "authorization": `Bearer ${twitter.bearerToken}`
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
    console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`);
}


const endpointURL = "https://api.twitter.com/2/users/by?usernames="
//smiley's twitter users to check for new tweets
const smileyUsers = ["rektproof", "elonmusk", "ShardiB2"]

async function getUser(twitter) {

    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const params = {
        usernames: smileyUsers.toString(), // Edit usernames to look up
        "user.fields": "created_at,description", // Edit optional query parameters here
        "expansions": "pinned_tweet_id",
        
    }

    // this is the HTTP header that adds bearer token authentication
    const res = await needle('get', endpointURL, params, {
        headers: {
            "User-Agent": "v2UserLookupJS",
            "authorization": `Bearer ${twitter.bearerToken}`
        }
    })

    if (res.body) {
        console.log(res.body);
        return res.body;
    } else {
        throw new Error('Unsuccessful request')
    }
}


module.exports = {
     getUserTimeline,
     getUser
}