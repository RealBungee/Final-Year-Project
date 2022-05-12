import structures from '../data/structures.js';

async function deregister(m){
    const index = structures.discordUsers.indexOf(m.author);
    if (index > -1){
        database.deregisterUser(m.author);
        structures.discordUsers.splice(index, 1);
        structures.registeredUsers.splice(index, 1);
        m.author.send(`You have succesfully deregistered from the bot. We're sad to see you go!`);
      }
}

export {
    deregister
}