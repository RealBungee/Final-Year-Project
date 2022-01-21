// Get User objects by username, using bearer token authentication

const needle = require('needle');
const { twitter } = require('./config.json');

const endpointURL = "https://api.twitter.com/2/users/by?usernames="

//smiley's twitter users to check for new tweets
const smileyUsers = ["rektproof", "elonmusk", "ShardiB2"]

async function getRequest() {

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
        return res.body;
    } else {
        throw new Error('Unsuccessful request')
    }
}

(async () => {

    try {
        // Make request
        const response = await getUserId.getRequest();
        console.dir(response, {
            depth: null
        });

    } catch (e) {
        console.log(e);
    }
})();
