const needle = require('needle');

async function getUser(twitter) {

    const endpointURL = "https://api.twitter.com/2/users/by?usernames="
    //smiley's twitter users to check for new tweets
    const smileyUsers = ["rektproof", "elonmusk", "ShardiB2"]
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
    getUser
}
