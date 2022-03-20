//fetches the discord user objects
//uses more memory, but this way we avoid waiting for response from discord during workflow
//slows down app start-up time
import structures from '../data/structures.js';

async function getDiscordUsers(client){
    for(let u of structures.registeredUsers){
        let user = await client.users.fetch(await client.users.resolveId(u.id));
        structures.discordUsers.push(user);
    }
}

export {
    getDiscordUsers
}