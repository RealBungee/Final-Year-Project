import structures from '../data/structures.js';
import database from '../helperFunctions/database.js';

async function deregister(interaction){
    const index = structures.discordUsers.indexOf(interaction.user);
    if (index > -1){
        structures.discordUsers.splice(index, 1);
        structures.registeredUsers.splice(index, 1);
        database.deregisterUser(interaction.user);
        interaction.reply(`You have succesfully deregistered from the bot. We're sad to see you go!`);
      }
}

export {
    deregister
}