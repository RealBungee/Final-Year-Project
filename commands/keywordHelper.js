import structures from '../data/structures.js';
import database from '../helperFunctions/database.js';

//helper function for followAccount and addKeywords functions
async function awaitKeywords(interaction, filter, account, keywords){
    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const keyword = collected.entries().next().value[1].content.toLowerCase();
            
            if(keyword == 'stop' && keywords.length > 0){
                const user = structures.registeredUsers.find(u => u.id == interaction.user.id);
                user.followedAccounts.set(account, keywords);
                database.updateFollowedAccount(user);
                interaction.followUp('Interaction stopped.');
                return;
            }

            if(keywords.includes(keyword)) {
                interaction.followUp(`The entered keyword has already been added. Type another or type stop.`);
            } else{
                keywords.push(keyword);
                interaction.followUp(`Saving keyword "${keyword}". Type another keyword or type stop to stop interaction.`);
            }
            awaitKeywords(interaction, filter, account, keywords);
        })
        .catch((err) => { console.log(err)});
}

export {
    awaitKeywords
}