import needle from 'needle';

//accepts user object only
//user object is then completed with the needed information
//this is used to retrieve username and id for easier requests in the future
async function getUserInfo(token, user) {

    const endpointURL = "https://api.twitter.com/2/users/by?usernames=";

    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const params = {
        usernames: user.username, // Edit usernames to look up
        // "user.fields": "created_at,description", // Edit optional query parameters here
        // "expansions": "pinned_tweet_id",
    }

    // this is the HTTP header that adds bearer token authentication
    const res = await needle('get', endpointURL, params, {
        headers: {
            "User-Agent": "v2UserLookupJS",
            "authorization": `Bearer ${token.bearerToken}`
        }
    });

    if (res.body) {
        console.log(res.body);
        user.id = res.body.data[0].id;
        user.name = res.body.data[0].name;
        user.username = res.body.data[0].username;
        user.lastTweet = '';
        return user;
    } else {
        throw new Error('Unsuccessful request');
    }
}

export  {
    getUserInfo
}
