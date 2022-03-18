//fetches the discord user objects
//uses more memory, but this way we avoid waiting for response from discord during workflow
//slows down app start-up time

async function getDiscordUsers(client, users){
    let temp = []
    for(let u of users){
        let user = await client.users.fetch(await client.users.resolveId(u.id));
        temp.push(user);
    }
    return temp;
}

export {
    getDiscordUsers
}